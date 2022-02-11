const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const ParkingLot = require('../model/parkinglotSchema');

module.exports = {
    parkingZoneCheck: function(req, res) {
        ParkingLot.find(function(err, docs) {
            res.render('../views/parkingReservation', {result : docs})
        })
    },

    // 예약 시간대 추가 함수 (시작, 종료 시간 + userId)
    parkingZoneReserve: function(req, res) {
        ParkingLot.findOneAndUpdate( {zoneName: req.body.zoneName},
            { $push: { "reservedTime": { "userId": req.cookies.userId, "startTime": req.body.startTime, "endTime": req.body.endTime} } },
            function(err, docs) {
                //push 메소드를 빼고 시간대 중복 검사
                console.log(docs);
                res.json({ msg: 'good'});
        })
        // 1. req.zoneName에 해당하는 데이터 find
        // 2. 해당 zone에서 시작~종료 시간이 겹치는 지 확인 or 프론트에서 검사해도 됨
        // 3. 안겹치면 insert
    }

    // 예약 시간 양도 함수 (시작, 종료 시간 + from userId + to userId)
};