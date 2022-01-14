const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const fcm = require('./fcm/fcm');
const userCtr = require('./userCtr')

module.exports = {
    carNumberCheck: async function(req, res) {
        Car.find( {carNumber: req.body.carNumber}, async function(err, carDoc) {
            if(carDoc[0]){
                carId = carDoc[0]._id.toString()
                User.find( {carId : carId} , async function(err, userDoc){
                    if(userDoc[0].fbToken){
                        userCtr.transaction(userDoc[0].kasAddress, userDoc[0].kasAddress, req.body.carNumber);
                        // timer = setTimeout(() => {
                        //     console.log("TIME OUT !!!")
                        //     process.removeAllListeners('customEvent')
                        // }, 2000);
                        // process.once('customEvent', function() {
                        //     clearTimeout(timer)
                        //     console.log("수신 확인")
                        // });

                        /*
                        1회용 이벤트 리스너 호출
                        페이지 응답 대기
                        응답에 따른 res 리턴 해주기

                        once리스너 -> 타이머 n초 작동 -> 응답 대기
                        -> 미응답 시 remove 리스너
 
                        응답 받을 때 사용자 식별은 어떻게??
                        이벤트 수신 이름을 사용자ID로 지정한다.
                        */

                        data = {
                            title: '[입차 알림]',
                            body: userDoc[0].realname+'님 ['+carDoc[0].carNumber+'] 차량 입차 하였습니다.'
                        }
                        fcm.fcmSendMessage(data, userDoc[0].fbToken)
                    }else{
                        console.log('소유주 알림 꺼져있음')
                    }
                })
                res.json({
                    isSuccess: 'true',
                    msg: '알림 전송됨'
                })
            }else{
                console.log("carNumber not matched")
                res.json({
                    isSuccess: 'false',
                    msg: 'carNumber not matched'
                })
            }
        })
    }
}