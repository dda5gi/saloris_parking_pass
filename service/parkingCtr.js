const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const ParkingLot = require('../model/parkinglotSchema');

module.exports = {
    // 차량 예약 내역 페이지 GET
    parkingZoneCheck: function(req, res) {
        ParkingLot.find(function(err, docs) {
            res.render('../views/parkingReservation', {result : {"zone": docs, "userId": req.cookies.userId }})
        })
    },

    // 예약 시간대 추가 함수 (시작, 종료 시간 + userId)
    parkingZoneReserve: function(req, res) {
        var startTime = Date.parse(req.body.startTime)
        var endTime = Date.parse(req.body.endTime)
        ParkingLot.findOneAndUpdate( {zoneName: req.body.zoneName},
            { $push: { "reservedTime": { "userId": req.cookies.userId, "startTime": startTime, "endTime": endTime} } },
            function(err, docs) {
                if(err){res.json({ isSuccess: 'false'});}
                //프론트에서 예약 시간 중복을 체크하지만 안정성을 위해 여기서도 체크하는 코드를 추가할 필요 있음
                // -> push를 제거 -> 시간 중복 체크 후 insert
                res.json({ isSuccess: 'true'});
        })
    },

    // 예약 시간 양도 함수 (예약내역 oid + from userId + to userId)
    parkingZoneHandOver: function(req, res) {
        console.log(req.body.consignee, req.body.reserveOid, req.body.zoneOid)
        // 인수자가 존재하는지 먼저 체크
        User.find( {loginId: req.body.consignee},
            function(err, docs){
                if(!docs[0]){
                    return res.json({
                        isSuccess: 'false',
                        msg: '존재하지 않는 유저입니다.'
                    })
                }else{
                    // 주차구역을 찾고 기존 예약자 필드를 인수자로 변경 해줌
                    ParkingLot.findOneAndUpdate(
                        {_id: req.body.zoneOid, reservedTime:{$elemMatch:{_id: req.body.reserveOid}}},
                        {$set:{"reservedTime.$.userId": req.body.consignee}},
                        function(err, docs){
                            if(err) console.error(err);
                            return res.json({
                                isSuccess: 'true',
                            })
                        }
                    )
                }
            }
        )
    }
};