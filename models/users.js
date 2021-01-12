//users.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    uid: String,
    name: String,
    profile: String,
    contacts: [[String, String]], //node js로 한 번 더 감싸야?
    gallery: [String],
    relation: [String], // 친구를 맺어야 하는 두 사용자의 uid를 받는다. 
    myfriends: [String] // 친구인 사람들의 uid를 저장해놓는다.
});
module.exports = mongoose.model('users', userSchema); //'users' collection with userSchema 