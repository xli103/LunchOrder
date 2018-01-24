var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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
	if(req.body.invitationCode !== "IHateEatingEveryDay!!!"){
		return res.render("register", {error: "请联系饭头获得入伙资格!"});
	}
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		chineseName: req.body.chineseName
	});
	if(req.body.adminCode === "useEnvParamToHideLater!"){
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
router.get("/orders-today", function(req, res){
	res.render("orders-today", {page: "orders-today"});
});

module.exports = router;