const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const ParkingLot = require('../model/parkinglotSchema');
const History = require('../model/historySchema')
const wallet = require('./kas/wallet');
const dataCrypt = require('./kas/dataCrypt');

module.exports = {
    // 차량 예약 내역 페이지 GET
    parkingZoneCheck: function(req, res) {
        ParkingLot.find(function(err, docs) {
            res.render('../views/parkingReservation', {result : {"zone": docs, "userId": req.cookies.userId }})
        })
    },

    // 주차구역 예약 함수 (시작, 종료 시간 + userId)
    parkingZoneReserve: function(req, res) {
        var startTime = Date.parse(req.body.startTime)
        var endTime = Date.parse(req.body.endTime)
        ParkingLot.findOneAndUpdate( {zoneName: req.body.zoneName},
            { $push: { "reservedTime": { "userId": req.cookies.userId, "startTime": startTime, "endTime": endTime} } },
            function(err, docs) {
                if(err){res.json({ isSuccess: 'false'});}
                //kasAddress를 얻기 위해 find
                User.find( {loginId: req.cookies.userId}, async function(err, userDoc){
                    let encData = dataCrypt.dataEncrypt(req.body.zoneName+req.cookies.userId+startTime+endTime)
                    const txHash = await wallet.sendTransfer(userDoc[0].kasAddress, userDoc[0].kasAddress, encData);
                    // DB insert
                    History.findOneAndUpdate( {userId: req.cookies.userId},
                        { $push: { "reservation": { "txHash": txHash, "zoneName": req.body.zoneName, "startTime": startTime, "endTime": endTime} } },
                        { upsert: true },
                        function(err, docs) {
                            if(err){res.json({ isSuccess: 'false'});}
                            res.json({ isSuccess: 'true'});
                    })
                })
        })
    },

    // 주차구역 예약 양도 함수 (예약내역 oid + from userId + to userId)
    parkingZoneHandOver: function(req, res) {
        console.log(req.body.consignee, req.body.reserveOid, req.body.zoneOid)
        // 인수자가 존재하는지 먼저 체크
        User.find( {loginId: req.body.consignee}, function(err, userToDoc){
            if(!userToDoc[0]){
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
                        console.log(docs);
                        // 받는이 kasAddress을 얻기 위해 find
                        User.find( {loginId: req.cookies.userId}, async function(err, userFromDoc){
                            let encData = dataCrypt.dataEncrypt(req.body.zoneName+req.cookies.userId+req.body.consignee+req.body.startTime+req.body.endTime)
                            const txHash = await wallet.sendTransfer(userFromDoc[0].kasAddress, userToDoc[0].kasAddress, encData);
                            // DB insert
                            History.findOneAndUpdate( {userId: req.cookies.userId},
                                { $push: { "handOver": { "txHash": txHash, "zoneName": req.body.zoneName, "startTime": req.body.startTime, "endTime": req.body.endTime, "from": req.cookies.userId, "to": req.body.consignee} } },
                                { upsert: true },
                                function(err, docs) {
                                    if(err) {res.json({ isSuccess: 'false'});}
                                    res.json({ isSuccess: 'true'});
                            })
                        })
                    }
                )
            }
        })
    }
};