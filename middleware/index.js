var User = require("../models/user");

// all the middleware goes here
var middlewareObj = {};

// logged in middleware
middlewareObj.isLoggedIn = function(req, res, next){
	//todo
};

module.exports = middlewareObj;