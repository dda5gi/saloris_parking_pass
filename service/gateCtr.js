const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const fcm = require('./fcm/fcm');
const wallet = require('./kas/wallet');

module.exports = {
    carNumberCheck: async function(req, res) {
        Car.find( {carNumber: req.body.carNumber}, async function(err, carDoc) {
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
                                + ']차량 입차 승인 바랍니다.'
                            },
                            "token": userDoc[0].fbToken
                        }
                        // 알림 전송
                        fcm.fcmSendMessage(message)

                        //입차 타이머 시작->시간 초과->이벤트 리스너 OFF
                        gateTimer = setTimeout(() => {
                            console.log("입차 대기 TIME OUT !!!")
                            process.removeAllListeners()
                            res.json({
                                isSuccess: 'false',
                                msg: '승인 대기시간 초과'
                            })
                        }, 5000);

                        //입차승인 이벤트 리스너->호출 시 타이머 OFF
                        process.once('allow', async function() {
                            process.removeAllListeners()
                            clearTimeout(gateTimer)
                            console.log(req.body.carNumber, "입차 승인")
                            let encData = wallet.dataEncrypt(req.body.carNumber)
                            const txHash = await wallet.sendTransfer(userDoc[0].kasAddress, userDoc[0].kasAddress, encData);
                            console.log('Tx result hash : ', txHash);
                            res.json({
                                isSuccess: 'true',
                                msg: '입차 승인'
                            })
                        });
                        //입차거부 이벤트 리스너->호출 시 타이머 OFF
                        process.once('deny', function() {
                            process.removeAllListeners()
                            clearTimeout(gateTimer)
                            console.log("입차 거부")
                            res.json({
                                isSuccess: 'false',
                                msg: '입차 거부'
                            })
                        });
                    }else{
                        console.log('소유주 알림 꺼져있음')
                        res.json({
                            isSuccess: 'false',
                            msg: '차량 소유주의 알림이 비활성화 되어 있습니다.'
                        })
                    }
                })
            }else{
                console.log("carNumber not matched")
                res.json({
                    isSuccess: 'false',
                    msg: '등록되지 않은 차량입니다.'
                })
            }
        })
    }
}