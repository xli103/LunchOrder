var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require('passport-local').Strategy,
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	User = require("./models/user"),
	Food = require("./models/food"),
	Order = require("./models/order"),
	Restaurant = require("./models/restaurant");

var app = express();

//Require routes
var indexRoutes = require("./routes/index");
var restaurantRoutes = require("./routes/restaurant");
var foodRoutes = require("./routes/food");
var orderRoutes = require("./routes/order");
var userRoutes = require("./routes/user");

//get rid of warnings
mongoose.Promise = global.Promise;
var url = process.env.DATABASEURL || "mongodb://localhost/lunch_order_app";

// APP config
app.use(bodyParser.urlencoded({extended: true}));

//set view engine, make .ejs file as default
app.set("view engine", "ejs");
//use style file
app.use(express.static(__dirname + "/public"));
//use method override
app.use(methodOverride("_method"));

//use connect flash
app.use(flash());
//moment js ---record time after post
app.locals.moment = require("moment");

//app.use(methodOverride("_method"));
//app.use(expressSanitizer());

// connect database 
mongoose.connect(url);

// PASSPORT CONFIGURATION
// ***** Basic Unsecure Method Here, MUST CHANGE if scenario changes!!!    *****
app.use(require("express-session")({
	secret: "Random sentence for generate ciphertext",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done) {
  	if(username === "admin"){
  		return done(null, false, {message: "怎么可能呢! 😁"});
  	}
    User.findOne({ username: username }, function (err, user) {
    	if(err) { return done(err); }
    	if(!user) {
        	return done(null, false, { message: "用户不存在，请联系饭头进行注册!" });
      	}
      	if (false) {
        	return done(null, false, { message: 'Incorrect password.' });
      	}
      	return done(null, user);
    	});
  	}
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use this function in every single route, and combine user information with every req
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error"); //error flash message
	res.locals.success = req.flash("success"); //success flash message
	next();
});

// Use Routes
app.use(indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/foods", foodRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);


//listen to port, start server
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The LunchOrder Server Has Started!");
})