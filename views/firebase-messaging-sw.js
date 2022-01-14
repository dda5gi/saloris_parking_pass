importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js",
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyDj_7i_joBFaiCd2Asol8GTJTEpwBrJOeM",
  authDomain: "saloris-test.firebaseapp.com",
  projectId: "saloris-test",
  storageBucket: "saloris-test.appspot.com",
  messagingSenderId: "81120770308",
  appId: "1:81120770308:web:9ca1a802dce84c077c7851",
  measurementId: "G-BW34QCLKVB"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
let enableForegroundNotification = true;

//크롬 서비스 워커에서 백그라운드 알림 수신을 처리한다.
messaging.setBackgroundMessageHandler(function(payload) {
    console.log(    
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body
    };
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});