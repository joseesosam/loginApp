var posteos = firebase.database().ref('posteos');
var comments = firebase.database().ref('comments');
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
class Posteo {
    key;
    userName;
    userKey;
    coment;
    likes;
    constructor() {
        this.key = "";
        this.userName = "";
        this.userKey = "";
        this.coment = "";
        // this.likes = 0; //CONVERTIMOS EN UNA MATRIZ
        this.likes = []; // DE ESTA MANERA PODEMOS SABER CON EXACTITUD QUIEN LE DIO 
        /*
            EL NUEVO FORMATO SERIA ASI
            this.likes[
                {
                userKey:'dsedrwf43tg53gvs',
                link:1 // variable solo de control. sirve para el unlinks
                }
            ]
         */
    }

}

class Comments {
    key;
    userName;
    userKey;
    comment;
    postKey;
    status;
    constructor() {
        this.key = "";
        this.userName = "";
        this.userKey = "";
        this.comment = "";
        this.postKey = "";
        this.status = "Activo";
    }
}



cargarPost();

var dataPosteos = [];

var updateOldLinks = (data) =>{
    if(data.likes == 0 || data.likes == undefined) data.likes = [];
    return data;
}





var commentCrud = {
    nameDB: 'comments', //NOMBRE DE LA TABLA DE LA DB
    view: function(dataPosteos){
        var cview = "", 
            div = "",
            getComment = this.read(dataPosteos.key); //Obtenemos los comentarios

            //VALIDAMOS QUE EXISTAM COMENTARIOS PARA EL POST
        if(getComment.length > 0){
            var tpl = [];
            var ui = 0;
            getComment.forEach(function(c){
                var r ="";
                for(var u in c){
                    r += `
                        <div class="usercomment">
                            <div class="text-rigth">${u}</div>
                    `;
                    c[u].forEach(function(d){
                        r += `<div class="content-comment">
                            <div class="expand">
                                <a href="#" data-bs-toggle="collapse" data-bs-target="#comme-user-${d.key}${ui}">+</a>
                            </div>
                            <div class="collapse val-comment" id="comme-user-${d.key}${ui}">
                                ${d.comment}
                            </div>
                        </div>`;
                    })
                    r+= `</div>`;
                }
                ui++;
            });
            view += tpl.join();
        }
            // Validamos si ay comentarios
        // if(cview == ""){
        //     cview = "No hay comentarios";
        // }
            div = `
        <div class="collapse pl-2 pb-5" id="comme-${dataPosteos.key}">
            <div class="content-comment">
                <div class="form-floating mt-2 mb-2">
                    <textarea class="form-control comment-text" placeholder="Leave a comment here"
                        style="height: 100px"></textarea>
                    <label class="mx-4" for="floatingTextarea2">Escribe un nuevo comentario</label>
                </div>
                <button type="button" class="btn btn-outline-primary" onclick="saveComment('${dataPosteos.key}','#comme-${dataPosteos.key}');">Comentar</button> </div>
           <div class="list-comment">${cview}</div>
           <div class="collapse pl-2 pb-5" id="commentarios-${dataPosteos.key}">
           </div>
        </div>
        `;

        

        console.log(getComment);
        return div;
    }, // RENDERISA LA VISTA DE LOS COMENTARIOS
    create:function(data){
        console.log(data);
        let newComment = comments.push();
        newComment.set({
            userName: userLogued.displayName,
            userKey: userLogued.uid,
            comment: data.comment,
            postKey: data.postKey,
            status: "Activo"
        });
        newComment.on('value', (snapshot) => {
        });
    }, // CREA UN COMENTARIO
    read:function(valore){
        var dataComment = [];
        firebase.database().ref(this.nameDB).once('value', function (data) {
            data.forEach(function(comt){
                var comment = new Comments();
                comment.key = "";
                comment.userName = comt.userName;
                comment.userKey = comt.userkey;
                comment.comment = comt.comment;
                comment.postKey = comt.postKey;
                comment.status = comt.status;
                dataComment.push(comment);
            })
        })
        var getcomment = [];
        dataComment.forEach(function(comments){
            var c = {
                /*
                Esta variable contendra algo asi:
                userKey:[{
                    ...datos de comentarios
                }]
                 */
            };
            // LO PRIMERO ES AVRIGUAR SI ESTE POST TIENE COMMENTARIOS
            if(valore == comments.postKey){
                let com = {
                    key: comments.key,
                    userName: comments.userName,
                    userKey: comments.userkey,
                    comment: comments.comment,
                    postKey: comments.postKey,
                    status: comments.status
                }; //OBJECTO AGRGADO AL AREA DE COMENTARIOS
                //VERIFICAMOS SI PARA EL USUARIO QUE COMENTO YA AVIA COMENTADO ANTES
                // SI NO A COMENTADO LE CREAMOS UN SLOT EN LA VARIABLE c
                if(Object.keys(c).indexOf(comments.userKey) == -1){
                    c[comments.userKey] = [];
                }
                c[comments.userKey].push(com);
            }
            getcomment.push(c);
        });
        return getcomment;
    }, // OBTIENE LOS COMENTARIOS SEGUN EL POSTKEY DADO
    update:function(idcoment, data){}, // ACTUALIZA UN COMENTARIO SEGUN EL ID
    delete: function(idcoment){} // borrar un comentario por su key
}

//La funcion que invoca el guardado
function saveComment(postKey, idcomentHtml){
    // HACEMOS USO DEL LIBRERIA JQUERY
    var coment = $(idcomentHtml); // OBTENEMOS EL PADRE CONTENEDOR DE COMENTARIOS
    var text = coment.find('textarea'); // OBTENEMOS EL COMENTARIO
    // INVOCAMOS EL CREADOR DE COMENTARIOS Y PASAMOS LOS DATOS COMO OBJETO
   commentCrud.create({
        comment:text.val(),
        postKey:postKey
    });
}
console.log(commentCrud.read(dataPosteos.key));

function cargarPost() {
    var dataPosteos = [];
    var tabla = "";
    firebase.database().ref('posteos').once('value', function (data) {
        data.forEach(function (post) {
            var postObject = new Posteo();
            postObject.key = post.key;
            postObject.userName = post.val().userName;
            postObject.userKey = post.val().userKey;
            postObject.coment = post.val().coment;
            postObject.likes = post.val().likes;
            dataPosteos.push(postObject);

        });
        for (var i = 0; i < dataPosteos.length; i++) {
            //let users = dataPosteos[i].likes != "" ? dataPosteos[i].likes.split(",") : [];
            // SOLO PARA REGISTROS ANTIGUOS
            dataPosteos[i] = updateOldLinks(dataPosteos[i]);
            // AHORA SOLO OBTENEMOS EL NUMERO DE REGISTROS DENTRO DE LA MATRIZ TOMANDO EN CUENTA
            // QUE CADA REGISTRO ES UN USUARIO
            let users = dataPosteos[i].likes.length;
            tabla += "<div class='row border border-dark col-10 mx-1'>";
            tabla += "<div class='form-floating mt-2 col-10'>";
            tabla += "<h2>";
            tabla += dataPosteos[i].userName;
            tabla += "</h2>";
            tabla += "<p>";
            tabla += dataPosteos[i].coment;
            tabla += "</p>";
            tabla += "</div>";
            tabla += "<div class='form-floating mt-5 col-2'>";
            tabla += "<a href='#' data-bs-toggle=\"collapse\" data-bs-target=\"#comme-"+dataPosteos[i].key+"\" onclick=\"loadPost(\'"+dataPosteos[i].key+"\')\" >Comentar</a> <br/>";
            tabla += "<a href='#' onclick=\"updateLike(\'" + dataPosteos[i].key + "\',\'" + userLogued.uid + "\')\">Likes</a> " + users/*.length ESTO YA NO ES NECESARIO*/;
            tabla += "</div>";
            tabla += commentCrud.view(dataPosteos[i]); //CARGAMOS lA VISTA
            tabla += "</div>";
        }
        $("#divComentarios").html("");
        $("#divComentarios").html(tabla);
    });


}

function loadPost(postKey){
    //aqui vamos a ir a buscar los comentarios del post
    
    firebase.database().ref('comments').once('value', function(data){
        var comentarios = [];
        data.forEach(function (comentario) {
            if(comentario.val().postKey == postKey){
                comentarios.push(comentario);
            }
        });

        var comentariosHTML = "";
        if(comentarios.length > 0){
            for(var i=0;i<comentarios.length;i++){
                comentariosHTML += "<p>";
                comentariosHTML += comentarios[i].val().comment;
                comentariosHTML += "</p>";
            }
    
            
        }else{
            comentariosHTML += "<p>";
                comentariosHTML +=  "No hay comentarios";
                comentariosHTML += "</p>";
        }
    
            $('#comme-'+postKey).append(comentariosHTML);
        
        
    });
}


function eliminar(key) {
    firebase.database().ref('posteos').child(key).remove();
    cargarPost();
}


function updateLike(postKey, userkey) {
    let postRef = firebase.database().ref("posteos").child(postKey);
    let postDB = "";
    postRef.once('value', function (data) {
       /* let usersString = data.val().likes; //ESTO RETORNA UN NUMERO
        if (usersString.includes(userkey)) { // ESTA FUNCION SE USA PARA AGRAGAR VALOR NO PARA VALIDAR
        CORRECCION
        */
        let values = data.val(); // OBTENEMOS TODOS LOS VALORES DEL ELEMENTO
        let links = values.likes == 0 ? [] : values.likes; // OBTENEMOS EL NUMERO DE ELEMENTOS SI ES INDEFINIDO SERA UN OBJECT POR DEFECTO
        let UserHas = links.filter(function(n) {
            return n.userKey == userkey; // OBTENEMOS TODOS LOS LINKS DE ESTE USUSARIO USUALMENTE SERIA UNO
        });
        
        if(UserHas.length > 0){ // VERIFICAMOS SI EL USUARIO ACTUAL YA DIO LINKS
           alert("ya le diste lyke, calma las pasiones")
        } else {
            // CREAMOS LA NUEVA MATRIS PARA ESTE USUARIO
            let l ={
                l:1,
                userKey:userkey
            }; 
            // SE LA SIGNAMOS A LAS DEMAS
            links.push(l);
            // ACTUALIZAMOS EL REGISTRO
            postRef.update({
                'likes': links,
            });
        }

    });


    postRef.on('value', (snapshot) => {
        cargarPost();
    });
}

function guardar() {
    if ($("#txtPost").val() != "") {
        let nuevoPost = posteos.push();
        nuevoPost.set({
            userName: userLogued.displayName,
            userKey: userLogued.uid,
            coment: $("#txtPost").val(),
            likes: [],
        });
        nuevoPost.on('value', (snapshot) => {
            cargarPost();
        });
        $("#txtPost").val("");
    }
}



// Otorgar persmisos y obtener token ***********************************************
const messaging = firebase.messaging();
messaging
    .requestPermission()
    .then(function () {
        MsgElem.innerHTML = "Se aceptaron los permisos para mensajes PUSH"
        console.log("Notification permission granted.");
        return messaging.getToken()
    })
    .then(function (token) {
        TokenElem.innerHTML = "El token es: " + token
    })
    .catch(function (err) {
        ErrElem.innerHTML = ErrElem.innerHTML + "; " + err
        console.log("No tieenes permisos para notificacioens.", err);
    });
// **********************************************************************************



// Mostrar mensajes ***************************************************************
let enableForegroundNotification = true;
messaging.onMessage(function (payload) {
    console.log("Mensaje Recibido. ", payload.notification);
    NotisElem.innerHTML = NotisElem.innerHTML + JSON.stringify(payload);

    if (enableForegroundNotification) {
        const { title, ...options } = JSON.parse(payload.data.notification);
        navigator.serviceWorker.getRegistrations().then(registration => {
            registration[0].showNotification(title, options);
        });
    }
});

 // *******************************************************************************