const Car = require('../model/carSchema')
const User = require('../service/userCtr');

module.exports = {
    // 자동차를 DB에 등록
    // 차량과 소유주는 N:M 관계로 저장
    carSignUp: async function(req, res) {
        Car.findOneAndUpdate(
            { carNumber: req.body.carNumber,
            manufacturer: req.body.manufacturer,
            carType: req.body.carType,
            carColor: req.body.carColor },
            { $addToSet: { userId: req.body.userId } },
            // addToSet - array 에서 중복 검사 후 push
            { upsert: false },
            // upsert - true: 대상이 없을 경우 종료, false: 있을 경우 마저 진행?
            function (err, docs) {
                if (err) console.error(err);
                if(docs != null){
                    // 대상이 없었으면 docs로 null리턴, 있었으면 오브젝트 리턴
                    console.log('existing car updated')
                    User.addCarId(docs._id, req.body.userId);
                }else{
                    var car = new Car(
                        {   carNumber: req.body.carNumber,
                            manufacturer: req.body.manufacturer,
                            carType: req.body.carType,
                            carColor: req.body.carColor,
                            userId: req.body.userId
                        }
                    )
                    car.save((err, docs) => {
                        if(err) console.error(err);
                        console.log('new car inserted');
                        User.addCarId(docs._id, req.body.userId);
                    });
                }
            },
            res.json({
                msg: 'good'
            })
        );
    }
};