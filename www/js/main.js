var mainApp = {};
var userLogued = 0;
(function(){

    var logtout = function(){
        firebase.auth().signOut().then(function(){
            console.log("ok");
            window.location.replace("login.html");
        },function(){})
    }

    var init = function(){
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                userLogued = user;
                console.log("logueado ok");
                //console.log(user);
                document.getElementById('aName').innerHTML = "Welcome, " + user.displayName + "!";
                if (userLogued.photoURL !== null) {
                    document.getElementById('perfilFoto').src = userLogued.photoURL;
                }
            }else{
                userLogued = 0;
                console.log("no logueado ok");
                window.location.replace("login.html");
            }
        });
    }

    init();

    mainApp.logout = logtout;
})();
