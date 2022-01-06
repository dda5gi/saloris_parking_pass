const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const wallet = require('./kas/wallet');

module.exports = {
    signUp: async function(req, res) {
        User.find( {loginId: req.body.loginId}, async function(err,docs) {
            if(docs[0]){
                console.log('[REGISTER REQUEST DENIED] : user overlapped');
                res.json({
                    msg: 'fail'
                })
            }
            else{
                console.log('[REGISTER REQUEST PROCESSING]');
                // KAS로부터 KEY 발급 후 DB 저장 코드
                // const account = await wallet.createAccount();
                // console.log(account);
                const user = new User({
                    loginId: req.body.loginId,
                    password: req.body.password,
                    realname: req.body.realname,
                    kasAddress: 'testAddress',
                    kasPublicKey: 'testKey',
                    // kasAddress: account.address,
                    // kasPublicKey: account.publicKey,
                });
                user.save((err, doc) => {
                    if (err) console.error(err);
                    console.log(doc);
                });
                res.json({
                    msg: 'ok',
                });
            };
        });
    },

    signIn: async function(req, res) {
        User.find( {loginId: req.body.loginId}, async function(err,docs) { 
            if(docs[0] && docs[0].password == req.body.password){
                console.log(docs)
                console.log('P/W MATCHED');
                res.cookie('userId', req.body.loginId);
                res.cookie('realname', req.body.realname, {
                    maxAge:60*60*1000,
                    path:"/"
                });
                res.json({ k: 'k' })
            }
            else{
                console.log('SIGN IN ERROR');
            }
        });
    },

    logout: async function(req, res) {
        console.log('LOG OUT REQUEST');
        res.clearCookie('userId');
        res.clearCookie('realname');
    },

    // USER에 CarId를 저장,, 고객 소유 차량 저장용,, 차량 등록 시 호출됨
    addCarId: async function(carUniqueId, userId) {
        console.log('my life for aiur', carUniqueId, userId)
        User.findOneAndUpdate({ loginId: userId },
            { $addToSet: { carId: carUniqueId } },
            { upsert: false },
            function (err, docs) {
                if(err) console.error(err);
                console.log(docs);
        });
    },

    carCheck: function(car) {

    }
};