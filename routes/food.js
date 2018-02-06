var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Food = require("../models/food");
var middleware = require("../middleware");


// New
// router.get("/new", function(req, res){
// 	//find campground by id
// 	Restaurant.findById(req.params.id, function(err, restaurant){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("foods/new", {restaurant: restaurant});
// 		}
// 	});	
// });


// Create
//Food Create
router.post("/", middleware.isAdminLoggedIn, function(req, res){
	//lookup restaurant using ID
	Restaurant.findById(req.params.id, function(err, restaurant){
		if(err){
			console.log(err);
			res.redirect("/restaurants");
		}else{
			Food.create(req.body.food, function(err, food){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					//save food
					food.save();
					//restaurant add food
					restaurant.foods.push(food._id);
					restaurant.save();
					req.flash("success", "Successfully added food!");
					res.redirect("/restaurants/" + restaurant._id);
				}
			});
		}
	});
});


// Show



// Edit



// Update. //check if admin
router.put("/:food_id", middleware.isAdminLoggedIn, function(req, res){
	Food.findByIdAndUpdate(req.params.food_id, req.body.food, function(err, updatedFood){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});



// Destory 
router.delete("/:food_id", middleware.isAdminLoggedIn, function(req, res){
	Food.findByIdAndRemove(req.params.food_id, function(err){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		}else{
			req.flash("success", "Food deleted");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});




module.exports = router;