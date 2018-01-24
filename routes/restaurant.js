var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");

// storage here

// index route
router.get("/", function(req, res){
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
router.get("/new", function(req, res){
	res.render("restaurants/new");
});

// CREATE
router.post("/", function(req, res) {
	//get data from form and add to restaurant array
		var name = req.body.name;
		console.log(req.body + "|");
		console.log(req.body.name + "|");
		var desc = req.body.description;
		console.log(req.body.description + "|");
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
router.get("/show", function(req, res){
	res.send("Chose restaurants here");
});

// EDIT

// UPDATE

// DESTORY

function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;