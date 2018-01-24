var mongoose = require("mongoose");

// Schema setup

var restaurantSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	// add provider here
	// add comments here
	popularFoods: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Food"
		}
	],
	normalFoods: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Food"
		}
	]

});

module.exports = mongoose.model("Restaurant", restaurantSchema);