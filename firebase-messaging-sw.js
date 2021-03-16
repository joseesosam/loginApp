importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js",
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js",
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  
	apiKey: "AIzaSyAUo36knLCANGoYsAq_dYBEvh1VXCGcpN8",
    authDomain: "mis-notas-cdba1.firebaseapp.com",
    databaseURL: "https://mis-notas-cdba1-default-rtdb.firebaseio.com",
    projectId: "mis-notas-cdba1",
    storageBucket: "mis-notas-cdba1.appspot.com",
    messagingSenderId: "210840024721",
    appId: "1:210840024721:web:820d7f9c7518e38f4d7130"
  });

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
	
	var mensaje = JSON.parse(payload.data.notification);	
	
    // Customize notification here
    const notificationTitle = mensaje.title; 
    const notificationOptions = {
        body: mensaje.body,
        icon: "https://marketing4ecommerce.net/wp-content/uploads/2018/01/Depositphotos_3667865_m-2015-compressor.jpg",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});