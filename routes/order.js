var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Food = require("../models/food");
var User = require("../models/user");
var Order = require("../models/order");
var middleware = require("../middleware");
var dailyRatio = require("../conf/daily_ratio");
var moment = require("moment");

// Index




// New




// Create
router.post("/", middleware.checkOrderTime, function(req, res) {
	//get data from form and add to restaurant array
	//Create a new order and save to DB
	var newOrder = new Order();
	newOrder.owner.id = req.user._id;
	newOrder.owner.uesrname = req.user.username;
	newOrder.owner.chineseName = req.user.chineseName;
	newOrder.foods.push(req.body.food);
	newOrder.save(function(error){
		if(error){
			console.log(error);
		}else{
			req.flash("success", "Successfully added to cart!");
			res.redirect("back");
		}
	});
});

// Show
router.get("/:id",  function(req, res){
	if(!req.user){
		req.flash("error", "Please login to do that!");
		res.redirect("/login");
	}
	User.findById(req.user._id, function(err, foundUser){
		if(err){
			req.flash("error", "Sorry, target user doesn't exist anymore");
			res.redirect("/restaurants");
		}
		var date = new Date();
		var start = moment().startOf("day");
		var end = moment().endOf("day");
		Order.find()
			 .where("owner.id").equals(foundUser._id)
			 .where("createdAt").gt(start).lt(end)
			 .exec(function(err, orders){
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("/restaurants");
			}
			var subtotal = 0;
			for(var i = 0; i < orders.length; i++) {
				subtotal += Number(orders[i].foods[0].totalPrice);
			}
			var total = (subtotal * dailyRatio.RATIO).toFixed(2);
			var extra = {subtotal: subtotal, total: total, dailyRatio: dailyRatio.RATIO};
			res.render("order/show", {user: foundUser, orders: orders, extra: extra});
		});
	});
});


// Edit



// Update
router.put("/:order_id", middleware.checkOrderOwnership, function(req, res){
	Order.findByIdAndUpdate(req.params.order_id, req.body.food, function(err, updatedFood){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "order updated")
			res.redirect("/orders/" + req.params.id);
		}
	});
});





// Destory
router.delete("/:order_id", middleware.checkOrderOwnership, function(req, res){
	Order.findByIdAndRemove(req.params.order_id, function(err){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		}else{
			req.flash("success", "Order deleted");
			res.redirect("/orders/req.user._id" + req.params.id);
		}
	});
});







module.exports = router;