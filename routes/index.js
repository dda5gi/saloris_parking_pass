const express = require('express');
const Car = require('../service/carCtr');
const User = require('../service/userCtr');
const router = express.Router();

router.get("/", (req, res) => { res.render('../views/index.html') });
router.get("/gate", (req, res) => { res.render('../views/gate.html') });

router.get("/userRegister", (req, res) => { res.render('../views/userRegister.html') });
router.post("/userRegister", async (req, res) => {
    console.log('register called');
    await User.signUp(req, res);
});
router.get("/login", (req, res) => { res.render('../views/login.html') });
router.post("/login", (req, res) => {
    console.log("login called");
    User.signIn(req, res);
});
router.get("/logout", async (req, res) => {
    console.log('logout called');
    User.logout(req, res);
    res.redirect('/');
})

router.get("/carRegister", (req, res) => { res.render('../views/carRegister.html') });
router.post("/carRegister", async (req, res) => {
    console.log('carRegister called');
    await Car.carSignUp(req, res);
})
router.get("/carCheck", (req, res) => { res.render('../views/carCheck.html') });


module.exports = router;