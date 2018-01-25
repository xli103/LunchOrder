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
			name: String,
			amount: Number
		}
	]
});

module.exports = mongoose.model("Order", orderSchema);