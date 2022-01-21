const express = require('express');
const Car = require('../service/carCtr');
const User = require('../service/userCtr');
const Gate = require('../service/gateCtr')
const router = express.Router();

router.get("/", (req, res) => { res.render('../views/index') });

router.get("/userRegister", (req, res) => { res.render('../views/userRegister') });
router.post("/userRegister", async (req, res) => {
    console.log('register called');
    await User.signUp(req, res);
});
router.get("/resignMember", async (req, res) => {
    await User.resignMember(req, res);
})
router.get("/login", (req, res) => { res.render('../views/login') });
router.post("/login", (req, res) => {
    console.log("login called");
    User.signIn(req, res);
});
router.get("/logout", async (req, res) => {
    console.log('logout called');
    User.logout(req, res);
    res.redirect('/');
})
router.post("/insertFbToken", async (req, res) => {
    console.log('insert fb token called');
    User.insertFbToken(req, res);
})
router.post("/deleteFbToken", async (req, res) => {
    console.log('delete fb token called');
    User.deleteFbToken(req, res);
})

router.get("/carRegister", (req, res) => { res.render('../views/carRegister') });
router.post("/carRegister", async (req, res) => {
    console.log('carRegister called');
    await Car.carSignUp(req, res);
})
router.get("/carCheck", (req, res) => {
    User.carCheck(req, res);
});
router.delete("/carDelete", (req, res) => {
    User.carDelete(req, res);
})

router.get("/gate", (req, res) => { res.render('../views/gate') });
router.post("/gate", async (req, res) => {
    console.log('gate called');
    await Gate.carNumberCheck(req, res);
})

router.get("/allowEnter", (req, res) => { res.render('../views/allowEnter') });
router.post("/allowEnter", (req, res) => {
    console.log('gate open response received');
    // if(req.body.msg === 'allow'){
        // 목표 => 백엔드는 입차 알림이 들어온 차량번호 String으로 고유의 이벤트 발생 시킴
        // 유저는 req.body에 해당하는 차량번호를 보내서 해당하는 이벤트만 종료한다.
        // 앱은 가능한데, Web은 서비스 워커가 URL 오픈을 처리한다. (노티 클릭 -> /allowEnter를 그냥 열어버림)
        // 백그라운드 수신의 경우 O -> 서비스 워커에 fcm payload가 저장 되기 때문에 URL 파라미터로 넘길 수 있음
        // 포그라운드 수신의 경우 X -> 프론트 스크립트에서 payload가 처리되기 때문에 URL 값 넘기기 불가
        
        // 1안 : payload에 링크 담아서 바로 여는 방법 찾기 (이전에 실패했음)
        // 2안 : 앱만 살리기 (이러면 웹 응답을 못씀)
        // 3안(이걸로 해결) : 서비스 워커의 이벤트 리스너에 payload 전달 가능 확인 -> 차량 번호 파싱
    //     process.emit('allow');
    // }
    // else{
    //     process.emit('deny');
    // }
    console.log("user emit :", req.body.msg)
    process.emit(req.body.msg)
})

module.exports = router;