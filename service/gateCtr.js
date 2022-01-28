const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const fcm = require('./fcm/fcm');
const wallet = require('./kas/wallet');
const dataCrypt = require('./kas/dataCrypt');
const waitTime = 20000; //서버가 유저 응답 기다릴 시간  
const fcmCompensateTime = 1000; //FCM 전송 딜레이에 따른 시간 보정용

module.exports = {
    carNumberCheck: async function(req, res) {
        //Todo : 차량인식 종합 정보로 수정 필요
        Car.find( {carNumber: req.body.carNumber}, async function(err, carDoc) {
            if(err) console.error(err);
            if(carDoc[0]){
                carId = carDoc[0]._id.toString()
                User.find( {carId : carId} , async function(err, userDoc){
                    //유저 토큰이 있는 경우 로직 진행
                    if(userDoc[0].fbToken){
                        message = {
                            // 앱에서 백그, 포그 둘 다 같은 동작 하려면 noti 말고 data 사용해야함
                            // "notification": {
                            //     "title": '[입차 알림]',
                            //     "body": userDoc[0].realname
                            //     + '님 ' + carDoc[0].carNumber
                            //     + '차량 입차 승인 바랍니다.'
                            // },
                            // "webpush": {
                            //     "fcm_options": {
                            //     "link": "http://localhost:3000/allowEnter"
                            //     }
                            // },
                            data: {
                                "title" : "[입차 알림]",
                                "body": userDoc[0].realname
                                + '님 [' + carDoc[0].carNumber
                                + ']차량 입차 승인 바랍니다.',
                                "deadline" : (Date.now() + (waitTime-fcmCompensateTime)).toString(),
                            },
                            "token": userDoc[0].fbToken
                        }
                        // 알림 전송6
                        fcm.fcmSendMessage(message)

                        //입차 타이머 시작->시간 초과->이벤트 리스너 OFF
                        gateTimer = setTimeout(() => {
                            console.log(carDoc[0].carNumber, "입차 대기 TIME OUT !!!")
                            process.removeAllListeners("allow"+carDoc[0].carNumber)
                            process.removeAllListeners("deny"+carDoc[0].carNumber)
                            return res.json({
                                isSuccess: 'false',
                                msg: '승인 대기시간 초과'
                            })
                        }, waitTime);

                        //입차승인 이벤트 리스너->호출 시 타이머 OFF
                        process.once("allow"+carDoc[0].carNumber, async function() {
                            process.removeAllListeners("deny"+carDoc[0].carNumber)
                            clearTimeout(gateTimer)
                            console.log(req.body.carNumber, "입차 승인")
                            let encData = dataCrypt.dataEncrypt(req.body.carNumber)
                            const txHash = await wallet.sendTransfer(userDoc[0].kasAddress, userDoc[0].kasAddress, encData);
                            console.log('Tx result hash : ', txHash);
                            return res.json({
                                isSuccess: 'true',
                                msg: '입차 승인'
                            })
                        });
                        //입차거부 이벤트 리스너->호출 시 타이머 OFF
                        process.once("deny"+carDoc[0].carNumber, function() {
                            process.removeAllListeners("allow"+carDoc[0].carNumber)
                            clearTimeout(gateTimer)
                            console.log(req.body.carNumber, "입차 거부")
                            return res.json({
                                isSuccess: 'false',
                                msg: '입차 거부'
                            })
                        });
                    }else{
                        console.log('소유주 알림 꺼져있음')
                        return res.json({
                            isSuccess: 'false',
                            msg: '차량 소유주의 알림이 비활성화 되어 있습니다.'
                        })
                    }
                })
            }else{
                console.log("carNumber not matched")
                return res.json({
                    isSuccess: 'false',
                    msg: '등록되지 않은 차량입니다.'
                })
            }
        })
    }
}