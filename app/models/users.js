'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	
	provider:String,
	id: String,
	displayName: String

});

module.exports = mongoose.model('User', User);
