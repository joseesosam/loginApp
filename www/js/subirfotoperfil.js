$(document).ready(function(){
    $("#fotoPerfil").on('change', function(){changeProfile();});
});
window.onload=function(){
    changeFoto();
}
function changeFoto(){
    var user = firebase.auth().currentUser;
    if(user != null){
        if(user.photoURL != null){
            $('#perfilFoto').attr("src",firebase.auth().currentUser.photoURL);
        }
    } 
}
function changeProfile(){
    if($("#fotoPerfil").val() != ''){
        // Create a root reference
        var storageRef = firebase.storage().ref();;
        // Create a reference to 'mountains.jpg'
        var imgProfileRef = storageRef.child(userLogued.uid+'profile.jpg');
        var file = $("#fotoPerfil").prop('files')[0];
        imgProfileRef.put(file).then(function(snapshot) {
            
            userLogued.updateProfile({
            photoURL: snapshot.downloadURL
            }).then(function() {
                changeFoto();
                alert("se actualizó la foto de usuario");
            }).catch(function(error) {
                alert("Error NO se actualizó la foto de usuario")
            });

        });
    }
}
