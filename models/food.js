var mongoose = require("mongoose");

var foodSchema = new mongoose.Schema({
	name: String,
	price: String,
	description: String,
});

module.exports = mongoose.model("Food", foodSchema);