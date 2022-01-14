const User = require('../model/userSchema');
const Car = require('../model/carSchema');
const carCtr = require('./carCtr');
const wallet = require('./kas/wallet');


module.exports = {
    transaction: async function(from, to, data) {
        let encData = wallet.dataEncrypt(data)
        const txHash = await wallet.sendTransfer(from, to, encData);
        console.log('Tx result hash : ', txHash);
    },

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
                const account = await wallet.createAccount();
                console.log(account);
                const user = new User({
                    loginId: req.body.loginId,
                    password: req.body.password,
                    realname: req.body.realname,
                    kasKeyId: account.keyId,
                    kasAddress: account.address,
                    kasPublicKey: account.publicKey,
                });
                user.save((err, doc) => {
                    if (err) console.error(err);
                    console.log(doc);
                });
                res.json({
                    msg: 'good',
                });
            };
        });
    },

    signIn: async function(req, res) {
        process.emit('customEvent');

        User.find( {loginId: req.body.loginId}, async function(err,docs) { 
            if(docs[0] && docs[0].password == req.body.password){
                console.log('user', docs[0].loginId, 'logined')
                console.log('P/W MATCHED');
                res.cookie('userId', req.body.loginId);
                res.cookie('realname', docs[0].realname);
                if(docs[0].fbToken) {
                    res.cookie('fbToken', docs[0].fbToken)
                }
                res.json({msg: 'good' })
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

    insertFbToken: async function(req, res) {
        User.findOneAndUpdate(
            {loginId : req.cookies.userId},
            { $set: { fbToken: req.body.fbToken } },
            function(err, docs) {
                if(err) console.error(err);
                console.log('fbToken insert')
                res.cookie('fbToken', req.body.fbToken)
                res.json({msg: 'good'})
            }
        )
    },

    deleteFbToken: async function(req, res) {
        User.findOneAndUpdate(
            {loginId : req.cookies.userId},
            { $unset: { fbToken: '' } },
            function(err, docs) {
                if(err) console.error(err);
                console.log('fbToken delete')
                res.clearCookie('fbToken');
                res.json({msg: 'good'})
            }
        )
    },

    //반드시 Key삭제 후 account를 삭제해야 키 사용량이 감소함
    //순서 어기면 계정은 삭제되고 키 사용량은 감소 안해서 복구 불가
    resignMember: async function(req, res) {
        const userId = req.cookies.userId
        User.find( {loginId: userId}, async function(err, docs) {
            //1. KEY 삭제 API 호출
            const keyStatus = await wallet.deleteKey(docs[0].kasKeyId);
            console.log('delKey_status : ', keyStatus)
            if(keyStatus === 'deleted') {
                //2. Account 삭제 API 호출
                const accountStatus = await wallet.deleteAccount(docs[0].kasAddress);
                console.log('delAccount_status : ', accountStatus)
                //유저 정보 DB에서 삭제
                User.deleteOne( { loginId: userId}, async function(err, docs2) {
                    if(err) console.error(err);
                    console.log('DB.userDel : ', docs2.result);
                    console.log(docs[0].carId, userId);
                    // 유저에 연결된 차량들 삭제 (소유주가 n명인 경우 관계만 끊음)
                    if(0 < docs[0].carId.length){
                        docs[0].carId.forEach(element => {
                            carCtr.carDrop(element, userId);
                        })
                    }
                    res.redirect("/logout")
                })
            }
            else {
                console.log('deleteKey ERROR');
            }
        })
    },

    carDelete: function(req, res) {
        User.findOneAndUpdate(
            {loginId: req.cookies.userId},
            { $pull: { carId : req.body.carId}},
            function(err, docs) {
                if(err) console.log(err);
                console.log(req.cookies.userId, req.body.carId)
                carCtr.carDrop(req.body.carId, req.cookies.userId)
        });
        res.json({ msg: 'good' })
    },

    // USER에 CarId를 저장,, 고객 소유 차량 저장용,, 차량 등록 시 호출됨
    addCarId: async function(carUniqueId, userId) {
        // 문자열로 변환하지 않으면 $oid형태로 들어가는데, 이렇게 넣으면 db update가 작동 안함
        carUniqueId = carUniqueId.toString()
        User.findOneAndUpdate({ loginId: userId },
            { $addToSet: { carId: carUniqueId } },
            { upsert: false },
            function (err, docs) {
                if(err) console.error(err);
        });
    },

    //유저가 소유한 차량 정보 출력
    carCheck: function(req, res) {
        const userId = req.cookies.userId
        var carInfos = new Array();
        User.find( {loginId: userId }, function(err, docs) {
            if(docs[0].carId[0]) {
                carIds = docs[0].carId;
                console.log('carIds:', carIds);
                carIds.forEach(element => {
                    Car.find({_id: element}, function(err, docs) {
                        if(err) console.error(err);
                        carInfos.push(docs[0]);
                        if(carIds.length == carInfos.length){
                            res.render('../views/carCheck', {result : carInfos})
                        }
                    })
                });
            }else{
                res.render('../views/carCheck', {result : 'empty'})
                console.log('carCheck : no car')
            }
        })
    }
};