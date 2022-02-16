const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    userId: {type: String, required: true},
    carEnter: [{txHash: {type: String}, carNumber: {type: String}, date: {type: Date}}],
    reservation: [{txHash: {type: String}, zoneName: {type: String}, startTime: {type: Date}, endTime: {type: Date}}],
    handOver: [{txHash: {type: String}, zoneName: {type: String}, startTime: {type: Date}, endTime: {type: Date}, from: {type: String}, to: {type: String}}],
});
    
const History = mongoose.model('History', historySchema);

module.exports = History;