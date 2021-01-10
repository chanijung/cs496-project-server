//users.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    uid: String,
    contact: {firstName: String, secondName: String, phone: String}
});
module.exports = mongoose.model('users', userSchema);