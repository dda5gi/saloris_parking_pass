const User = require('../model/userSchema');
const Car = require('../model/carSchema');

module.exports = {
    carNumberCheck: async function(req, res) {
        Car.find( {carNumber: req.body.carNumber}, async function(err, docs) {
            if(docs[0]){
                inp = docs[0]._id.toString()
                User.find( {carId : [inp]} , async function(err, docs2){
                    console.log(docs2[0].fbToken)
                })
                /*
                1. 차량에 해당하는 유저 토큰 찾기 (스키마 수정 필요)
                2. FCM으로 토큰에 푸쉬 메세지 보내기
                메세지-> 승인 페이지 리다이렉팅
                -> 서버로 승인/거부 POST 통신
                -> 서버 응답 수신 -> 차단기로 전송.. (POST???)

                또는 XMPP로 메세지 업스트림 구축?? -> 불가능 예상

                fcm 호출 -> 승인 결과 response 코드 필요
                */
                res.json({
                    isSuccess: 'true',
                    msg: 'open'
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