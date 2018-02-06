var mongoose = require("mongoose");

// Schema setup

var restaurantSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	delivery_fee: String,
	isActive: {type: Boolean, defalut: false},
	// add provider here
	// add comments here
	foods: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Food"
		}
	]
},{usePushEach: true});

module.exports = mongoose.model("Restaurant", restaurantSchema);