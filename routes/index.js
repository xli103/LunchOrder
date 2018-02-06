var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var Order = require("../models/order");
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");
var dailyRatio = require("../conf/daily_ratio");
var moment = require("moment");

//root page
router.get("/", function(req, res){
	res.render("landing");
});

// show register form
router.get("/register", function(req, res){
	res.render("register", {page: "register"})
});

// handle sign up logic
router.post("/register", function(req, res){
	// auto-generate or delete if scenario changes
	// Use env on deploy
	if(req.body.invitationCode !== process.env.INVITATIONCODE){
		return res.render("register", {error: "请联系饭头获得入伙资格!"});
	}
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		chineseName: req.body.chineseName
	});
	if(req.body.adminCode === process.env.ADMINCODE){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
		res.redirect("/login");
	});
});

// show login form
router.get("/login", function(req, res){
	if(req.user){
		return res.redirect("/orders-today");
	}
	res.render("login", {page: "login"});
});

// handle login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/orders-today",
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res){
	// nothing to do here
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/login");
});


// show foods page
router.get("/orders-today", middleware.isLoggedIn, function(req, res){
	var date = new Date();
	var start = moment().startOf("day");
	var end = moment().endOf("day");
	Order.find()
			 .where("createdAt").gt(start).lt(end)
			 .exec(function(err, orders){
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("/restaurants");
			}
			var cloned = JSON.parse(JSON.stringify(orders));
			var foodStatic = getDishCount(cloned);
			//foodStatic = JSON.stringify(cloned);
			Restaurant.find({isActive: true}, function(err, restaurants){
				if(err){
					req.flash("error", "Something went wrong");
					res.redirect("/landing");
				}

				var subtotal = 0;
				var total = 0;
				var extra = 0;
				var tax = 0;
				var ratio = dailyRatio.RATIO;
				if(restaurants.length >= 1){
					extra = Number(restaurants[0].delivery_fee);
					for(var i = 0; i < orders.length; i++) {
						subtotal += Number(orders[i].foods[0].totalPrice);
					}
					tax = (subtotal * 0.07);
					total = subtotal + tax + extra;
					ratio = (total / subtotal).toFixed(4);
					dailyRatio.RATIO = ratio;
				}
				var orderReview = {subtotal: subtotal.toFixed(2), total: total.toFixed(2), tax: tax.toFixed(2), extra: extra.toFixed(2), ratio: ratio};
				res.render("orders-today", {orders: orders, foodStatic: foodStatic, restaurants: restaurants, orderReview: orderReview});
			});
		});
});

// function
function getDishCount(arr) {
	var obj = {};
	var map = new Map();
	var res = new Array();
	for(var i = 0; i < arr.length; i++) {
		var t = arr[i];
		if(map.has(t.foods[0].name)){
			var update = map.get(t.foods[0].name);
			update.amount = Number(t.foods[0].amount) + Number(update.amount);
			update.totalPrice = Number(t.foods[0].totalPrice) + Number(update.totalPrice);
			update.totalPrice = update.totalPrice.toFixed(2);
			map.set(t.foods[0].name, update);
		}else{
			t.foods[0].totalPrice = Number(t.foods[0].totalPrice);
			map.set(t.foods[0].name, t.foods[0]);
		}
	}
	//console.log(map);
	for(var key of map){
		var food = {name: key[1].name, amount: key[1].amount, totalPrice: key[1].totalPrice};
		res.push(food);
	}
	return res;
}




module.exports = router;