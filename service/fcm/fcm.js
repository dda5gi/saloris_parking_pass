const admin = require('firebase-admin');
let serviceAccount = require('/saloris-test-firebase-adminsdk-qr8bj-1368244521.json'); 

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })