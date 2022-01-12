const mongoose = require("mongoose");
const Car = require('./carSchema');

const userSchema = new mongoose.Schema({
    loginId: { type: String, required: true },
    password: { type: String, required: true },
    regDate: { type: Date, default: Date.now },
    realname: String,
    fbToken: String,
    kasPublicKey: { type: String, required: true },
    kasAddress: { type: String, required: true },
    kasKeyId: {type: String, required: true},
    carId: []
});

const User = mongoose.model('User', userSchema);

module.exports = User;