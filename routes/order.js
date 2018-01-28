var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Food = require("../models/food");
var User = require("../models/user");
var Order = require("../models/order");
var middleware = require("../middleware");

// Index




// New




// Create
router.post("/", middleware.checkOrderTime, function(req, res) {
	//get data from form and add to restaurant array
	console.log(req.body.food);
	console.log(req.user);
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

	// Order.create(function(err, newOrder){
	// 	if(err){
	// 		req.flash("error", err.message);
	// 		res.redirct("back");
	// 	}else{
	// 		newOrder.owner.id = req.user._id;
	// 		newOrder.owner.username = req.user.username;
	// 		newOrder.owner.chineseName = req.user.chineseName;
	// 		newOrder.foods.push(req.body.food);
	// 		//save
	// 		newOrder.save();
	// 		//redirct to restaurants page
	// 		req.flash("success", "Successfully added to cart!")
	// 		res.redirect("back");
	// 	}
	// });
});

// Show
router.get("/:id",  function(req, res){
	if(!req.user){
		req.flash("error", "这种行为不是很有意思");
		res.redirect("/login");
	}
	User.findById(req.user._id, function(err, foundUser){
		if(err){
			req.flash("error", "Sorry, target user doesn't exist anymore");
			res.redirect("/restaurants");
		}
		var date = new Date();
		var start = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
		var end = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1);
		Order.find()
			 .where("owner.id").equals(foundUser._id)
			 .where("createdAt").gt(start).lt(end)
			 .exec(function(err, orders){
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("/restaurants");
			}
			res.render("order/show", {user: foundUser, orders: orders});
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