var fireBase = fireBase || fireBase;
var storage;
var hasInit = false;
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAUo36knLCANGoYsAq_dYBEvh1VXCGcpN8",
    authDomain: "mis-notas-cdba1.firebaseapp.com",
    projectId: "mis-notas-cdba1",
    storageBucket: "mis-notas-cdba1.appspot.com",
    messagingSenderId: "210840024721",
    appId: "1:210840024721:web:820d7f9c7518e38f4d7130"
};


if(!hasInit){
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    storage = firebase.storage();
    hasInit = true;
}