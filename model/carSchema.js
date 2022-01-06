const mongoose = require("mongoose");
const User = require('./userSchema');

const carSchema = new mongoose.Schema({
    carNumber: { type: String, required: true },
    manufacturer: { type: String, required: true },
    carType: { type: String, required: true },
    carColor: { type: String, required: true },
    userId: []
});
    
const Car = mongoose.model('Car', carSchema);

module.exports = Car;