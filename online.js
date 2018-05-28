var mongoose = require("mongoose");

var onlineSchema = new mongoose.Schema({
	name: String,
	s_id: String
});

module.exports = mongoose.model('online',onlineSchema);