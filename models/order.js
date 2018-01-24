var mongoose = require("mongoose");

var orderSchema = mongoose.Schema({
	createdAt: {type: Date, default: Date.now},
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	foods: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Food"
		},
		amounts: String
	]
});

module.exports = mongoose.model("Order", orderSchema);