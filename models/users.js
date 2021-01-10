//users.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    uid: String,
    contacts: [[String, String]] //node js로 한 번 더 감싸야?
});
module.exports = mongoose.model('users', userSchema); //'users' collection with userSchema 