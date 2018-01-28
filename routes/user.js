var express = require("express");
var User = require("../models/user");
var Order = require("../models/order");
var router = express.Router();
var middleware = require("../middleware");


// user profiles
router.get("/:id", middleware.isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "Sorry, target user doesn't exist anymore");
			res.redirect("/orders-today");
		}
		Order.find().where("owner.id").equals(foundUser._id).exec(function(err, orders){
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("/campgrounds");
			}
			res.render("user/show", {user: foundUser, orders: orders});
		});
	});
});




module.exports = router;