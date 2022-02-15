const express = require('express');
const Car = require('../service/carCtr');
const User = require('../service/userCtr');
const Gate = require('../service/gateCtr');
const Parking = require('../service/parkingCtr');
const tokenHistory = require('../service/kas/tokenHistory');
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
router.get("/carCheck", async (req, res) => {
    User.carCheck(req, res);
});
router.delete("/carDelete", (req, res) => {
    User.carDelete(req, res);
})

router.get("/carEnterHistory", async (req, res) => {
    res.render('../views/carEnterHistory')
});
router.post("/carEnterHistory", async (req, res) => {
    User.carEnterHistory(req, res);
})

router.get("/parkingReservation", async (req, res) => {
    Parking.parkingZoneCheck(req, res);
});
router.post("/parkingReservation", async (req, res) => {
    Parking.parkingZoneReserve(req, res);
});

router.post("/parkingHandOver", async (req, res) => {
    Parking.parkingZoneHandOver(req, res);
});

router.get("/gate", (req, res) => { res.render('../views/gate') });
router.post("/gate", async (req, res) => {
    console.log(req.body)
    console.log('gate called');
    await Gate.carNumberCheck(req, res);
})

router.get("/allowEnter", (req, res) => { res.render('../views/allowEnter') });
router.post("/allowEnter", (req, res) => {
    console.log('gate open response received');
    // req.body.msg == 차량번호 => 차량 번호에 해당하는 이벤트 리스너만 종료한다.
    console.log("user emit :", req.body.msg)
    process.emit(req.body.msg)
})

module.exports = router;