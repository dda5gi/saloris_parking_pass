const admin = require('firebase-admin');
let serviceAccount = require('./saloris-test-firebase-adminsdk-qr8bj-1368244521.json'); 
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

module.exports = {
    fcmSendMessage: async function(data, token){
        let message = {
            data: data,
            token: token
        };
        console.log('fcmSend: ', message.data)
        admin.messaging().send(message).then(function (response) {
            console.log('Successfully sent FCM message: : ', response)
        }).catch(function (err) {
            console.log('Error Sending FCM message!!! : ', err)
        })
    }
}