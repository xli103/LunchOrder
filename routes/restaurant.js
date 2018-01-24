var express = require("express");
var router = express.Router();


// storage here


router.get("/new", function(req, res){
	res.render("restaurants/new");
});


module.exports = router;