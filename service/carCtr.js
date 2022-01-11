const Car = require('../model/carSchema');

module.exports = {
    // 자동차를 DB에 등록
    // 차량과 소유주는 N:M 관계로 저장
    carSignUp: async function(req, res) {
        const userCtr = require('./userCtr');
        Car.findOneAndUpdate(
            { carNumber: req.body.carNumber,
            manufacturer: req.body.manufacturer,
            carType: req.body.carType,
            carColor: req.body.carColor },
            // addToSet - 차가 존재하면 array 에서 소유주 중복 검사 후 push 등록
            { $addToSet: { userId: req.body.userId } },
            { upsert: false },
            // upsert - true: 대상이 없을 경우 종료, false: 있을 경우 마저 진행???
            function (err, docs) {
                if (err) console.error(err);
                if(docs != null){
                    // 대상이 없었으면 docs로 null리턴, 있었으면 오브젝트 리턴
                    console.log('existing car updated')
                    // 이미 존재하는 차에 소유주만 등록 했다.
                    // 사용자의 소유 차량 정보에도 등록해준다.
                    userCtr.addCarId(docs._id, req.body.userId);
                }else{
                    var car = new Car(
                        {   carNumber: req.body.carNumber,
                            manufacturer: req.body.manufacturer,
                            carType: req.body.carType,
                            carColor: req.body.carColor,
                            userId: req.body.userId
                        })
                    car.save((err, docs) => {
                        if(err) console.error(err);
                        console.log('new car inserted');
                        // 사용자의 소유 차량 정보에도 등록해준다.
                        userCtr.addCarId(docs._id, req.body.userId);
                    });
                }
            },
            res.json({
                msg: 'good'
            })
        );
    },

    carDrop: async function(carId, userId) {
        console.log('carDrop called')
        Car.find( {_id : carId} , function(err, docs) {
            if(err) console.error(err);
            //차량 소유주가 1명인 경우 -> 차량 완전 삭제
            if(docs[0].userId.length <= 1){
                Car.deleteOne( {_id: carId}, function(err, docs) {
                    if(err) console.log(err);
                    console.log('carDrop : ', docs.result);
                })
            }
            //차량 소유주가 여러명인 경우 -> 차량 유지 & 관계만 끊기
            else{
                Car.findOneAndUpdate(
                    {_id: carId },
                    { $pull: { userId : userId} },
                    function(err, docs){
                        if(err) console.log(err);
                        console.log('relationDrop : ', docs.result);
                })
            }
        })
    }
};