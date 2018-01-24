var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");



var UserSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: String,
	firstName: String,
	lastName: String,
	chineseName: String,
	email: {type: String, unique: true},
	invitationCode: String,
	isAdmin: {type: Boolean, defalut: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);