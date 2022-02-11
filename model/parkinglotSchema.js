const mongoose = require("mongoose");

const parkingLotSchema = new mongoose.Schema({
    zoneName: {type: String, required: true},
    reservedTime: [{userId: {type: String}, startTime: {type: Date}, endTime: {type: Date}}] // 예약자 + 시작/종료 시간
});
    
const ParkingLot = mongoose.model('ParkingLot', parkingLotSchema);

module.exports = ParkingLot;