const express = require('express');
const Car = require('../service/carCtr');
const User = require('../service/userCtr');
const router = express.Router();

router.get("/", (req, res) => { res.render('../views/index') });
router.get("/gate", (req, res) => { res.render('../views/gate') });

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

module.exports = router;