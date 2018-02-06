var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");
// storage here

// index route
router.get("/", middleware.isLoggedIn, function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Restaurant.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allRestaurants) {
            Restaurant.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allRestaurants.length < 1) {
                        noMatch = "No Restaurant match that query, please try again.";
                    }
                    res.render("restaurants/index", {
                        restaurants: allRestaurants,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all campgrounds from DB
        Restaurant.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allRestaurants) {
            Restaurant.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("restaurants/index", {
                        restaurants: allRestaurants,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});

// NEW
router.get("/new", middleware.isAdminLoggedIn, function(req, res){
	res.render("restaurants/new", {page: "new"});
});

// CREATE
router.post("/", middleware.isAdminLoggedIn, function(req, res) {
	//get data from form and add to restaurant array
		var name = req.body.name;
		var desc = req.body.description;
		var newRestaurant = {name: name, description: desc};
		//Create a new restaurant and save to DB
		Restaurant.create(newRestaurant, function(err, newlyCreated){
			if(err){
				req.flash("error", err.message);
				res.redirct("back");
			}else{
				//redirct to restaurants page
				res.redirect("/orders-today");
			}
		});
});

// SHOW
router.get("/:id", middleware.isLoggedIn, function(req, res){
	//find the restaurant with provided ID
	Restaurant.findById(req.params.id).populate("foods").exec(function(err, foundRestaurant){
		if(err || !foundRestaurant){
			req.flash("error", "Restaurant not found");
			res.redirect("back");
		}else{
			//render show template with that restaurant
			res.render("restaurants/show", {restaurant: foundRestaurant});
		}
	});
});

// EDIT
router.get("/:id/edit", middleware.isAdminLoggedIn, function(req, res){
		Restaurant.findById(req.params.id, function(err, foundRestaurant){
			res.render("restaurants/edit", {restaurant: foundRestaurant});
		});
		
});

// UPDATE
router.put("/:id", middleware.isAdminLoggedIn, function(req, res){
	//find and update the correct restaurant
	var name = req.body.name;
	var desc = req.body.description;
	var isActive = req.body.isActive;
	var image = req.body.image;
	var delivery_fee = req.body.delivery_fee
	var newRestaurant = {name: name, description: desc, isActive: isActive, image: image, delivery_fee: delivery_fee};
  	//update
  	Restaurant.findByIdAndUpdate(req.params.id, newRestaurant, function(err, updatedRestaurant){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			req.flash("success", "Successfully Updated!");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});


// DESTORY
router.delete("/:id", middleware.isAdminLoggedIn, function(req,res){
	Restaurant.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/restaurants");
		}else{
			res.redirect("/restaurants");
		}
	});
});



function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;