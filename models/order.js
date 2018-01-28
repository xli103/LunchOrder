var mongoose = require("mongoose");

var orderSchema = mongoose.Schema({
	createdAt: {type: Date, default: Date.now},
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		chineseName: String
	},
	foods: [
		{
			name: String,
			amount: Number,
			totalPrice: String
		}
	]
});

module.exports = mongoose.model("Order", orderSchema);