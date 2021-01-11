//users.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    uid: String,
    name: String,
    profile: String,
    contacts: [[String, String]], //node js로 한 번 더 감싸야?
    gallery: [String]
});
module.exports = mongoose.model('users', userSchema); //'users' collection with userSchema 