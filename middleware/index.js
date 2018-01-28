var User = require("../models/user");
var Restaurant = require("../models/restaurant");
var Food = require("../models/food");
var Order = require("../models/order");

// all the middleware goes here
var middlewareObj = {};

// logged in middleware
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

// Admin logged in middleware
middlewareObj.isAdminLoggedIn = function(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin){
		return next();
	}
	req.flash("error", "You do not have permission to do that!");
	res.redirect("/orders-today");
};

// check orders onwership
middlewareObj.checkOrderOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Order.findById(req.params.order_id, function(err, foundOrder){
			if(err || !foundOrder){
				req.flash("error", "Order not found");
				res.redirect("back");
			}else{
				//does user own the campground?
				if(foundOrder.owner.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
};

// check order time
middlewareObj.checkOrderTime = function(req, res, next){
	if(req.isAuthenticated()){
		if(checkTime()){
			next();
		}
		req.flash("error", "点餐时间已过，请明天再来!");
		res.redirect("/orders-today");
	}else{
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
};

function checkTime() {
	var date = new Date();
	var flag = true;
	if(date.getHours() == 11) {
		if(date.getMinutes() > 19) {
			flag = false;
		}
	}
	if(date.getHours() > 11) {
		flag = false;
	}
	return flag;
}

module.exports = middlewareObj;