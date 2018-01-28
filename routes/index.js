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
	var start = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	var end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1);
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
				res.render("orders-today", {orders: orders, foodStatic: foodStatic, restaurants: restaurants});
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