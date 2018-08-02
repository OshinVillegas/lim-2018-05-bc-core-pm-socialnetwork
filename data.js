const register = document.getElementById('register');
register.addEventListener('click',()=>{
    document.getElementById('outForm').style.display='block';
    document.getElementById('inForm').style.display='none';
})
const ingreso = document.getElementById('ingreso');
ingreso.addEventListener('click',()=>{
    document.getElementById('inForm').style.display='block';
    document.getElementById('outForm').style.display='none';
})


function guardaDatos(user) {
    var usuario = {
        uid: user.uid,
        nombre: user.displayName,
        email: user.email,
        foto: user.photoURL
    }
    
    firebase.database().ref('freww/' + user.uid)
        .set(usuario)
}

const google = document.getElementById('google');
const facebook = document.getElementById('facebook');
const facebook1= document.getElementById('facebook1');
const google1 = document.getElementById('google1');




var provider = new firebase.auth.GoogleAuthProvider();
const inGoogle= ()=>{
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log(result.user);
            guardaDatos(result.user);
            $('#root').hide();
            $('#data').show()
            $('#Profile').append("<img style='height:106px;width:106px;border-radius:100px;float:center' src='"+result.user.photoURL+"'/>");
            $('#UserCount').append("<p>"+result.user.displayName+"</p>");
            $('#ProfilePhoto').append("<img style='height:200px;width:200px;float:center' src='"+result.user.photoURL+"'/>");
            $('#nameUser').append("<p style='font-size:30px'>"+result.user.displayName+"</p>");
         
        });
}


const log = new firebase.auth.FacebookAuthProvider();
const inFacebook = () => {
    log.addScope('public_profile');
    firebase.auth().signInWithPopup(log)
        .then(function (result) {
            console.log(result.user);
            guardaDatos(result.user);
            $('#root').hide();
            $('#data').show(); 
            $('#Profile').append("<img style='height:106px;width:106px;border-radius:100px;float:center' src='"+result.user.photoURL+"'/>");
            $('#UserCount').append("<p>"+result.user.displayName+"</p>");
        });
}

google.addEventListener('click',inGoogle);
facebook.addEventListener('click',inFacebook);
google1.addEventListener('click', inGoogle)
facebook1.addEventListener('click', inFacebook)





$('#ingresa').click(()=>{
    const emailIngreso = document.getElementById("email").value;
    const contrasenaIngreso = document.getElementById("contrasena").value;
    firebase.auth().signInWithEmailAndPassword(emailIngreso, contrasenaIngreso)
        .then(function (result) {
            console.log(result.user);
            guardaDatos(result.user);
            $('#root').hide();
            $('#data').append("<img src ='imagenes/sin_perfil.png' />").show();
});
})

document.getElementById('registrar').addEventListener("click", loginEmail);
function loginEmail() {
    const email1 = document.getElementById("email1").value;
    const pass = document.getElementById("pass").value;
    firebase.auth().createUserWithEmailAndPassword(email1, pass)
        .then(result => {
            const user = firebase.auth().currentUser;
            user.sendEmailVerification().then(function () {
                // enviando Email
                console.log('enviando correo---')
                guardaDatos(result.user);
            }).catch(function (error) {
                console.log(error)
            });
        })
        .catch(error => console.log(`Error ${error.code}:${error.message}`))
}


document.getElementById('botoncerrar').addEventListener('click', cerrar);
function cerrar() {
    firebase.auth().signOut()
        .then(function result() {
            console.log('saliendo...')
            window.location.href = 'index.html'
            $('#root').show();
        });
} 
firebase.initializeApp({
    apiKey: "AIzaSyAd-_QsITc2hsVEPLgnB2TSVLe2xkfT8fs",
    authDomain: "nuestra-red-social.firebaseapp.com",
    projectId: "nuestra-red-social"
});

// Initialize Cloud Firestore through Firebase
// var db = firebase.firestore();

// function guardar() {
//     let post = document.getElementById('post').value;
//     db.collection("users").add({
//         first: post,
        
    
//     })
//         .then(function (docRef) {
//             console.log("Document written with ID: ", docRef.id);
//             document.getElementById("post").value = '';
//         })
//         .catch(function (error) {
//             console.error("Error adding document: ", error);
//         });

// }   

// leer datos
let content = document.getElementById('content');
db.collection("users").onSnapshot((querySnapshot) => {
    console.log(querySnapshot)
    content.innerHTML = '';
    querySnapshot.forEach((doc) => {
        content.innerHTML +=`
           <div id=${doc.id}></div>  
                <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
                <div id='prof' class="w3-left w3-circle w3-margin-right" style="width:60px"></div>
                <span class="w3-right w3-opacity">16 min</span>
                <div id='nam'></div><br>
                <div>${doc.data().first}</div>
                <hr class="w3-clear">
                <button id="fb-root" data-layout="button_count" type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="far fa-thumbs-up"></i> Me Gusta</button> 
                <button id="plusone-div" type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i>  Comentar</button> 
                <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "eliminar('${doc.id}')"><i class="far fa-trash-alt"></i>Elimina</button>           
                <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "editar('${doc.id}','${doc.data().first}')"><i class="far fa-edit"></i> Editar</button>
                </div> 
                </div><br>`
    });
});

// borrar datos

function eliminar(id){
    db.collection("users").doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}



//editar
function editar(id,post){
    document.getElementById('post').value = post;

    let boton = document.getElementById('boton');
    boton.innerHTML = 'Editar';

    boton.onclick = function () {
        var Ref = db.collection("users").doc(id);

        let post = document.getElementById('post').value;

        return Ref.update({
            first: post
        })
            .then(function () {
                console.log("ya subio");
                boton.innerHTML = 'postear';
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}



var imagenes=new Array(
    ['imagenes/frase1.png','http://www.lawebdelprogramador.com/cursos/'],
    ['imagenes/frase2.png','http://www.lawebdelprogramador.com/foros/'],
    ['imagenes/frase3.png','http://www.lawebdelprogramador.com/pdf/'],
    ['imagenes/frase4.png','http://www.lawebdelprogramador.com/pdf/'],
);
//  Funcion para cambiar la imagen y link 
function rotarImagenes()
{   // obtenemos un numero aleatorio entre 0 y la cantidad de imagenes que hay
    var index=Math.floor((Math.random()*imagenes.length));
    // cambiamos la imagen y la url
    document.getElementById("imagen").src=imagenes[index][0];
    document.getElementById("link").href=imagenes[index][1];
}
// Función que se ejecuta una vez cargada la página
onload= function()
{
    // Cargamos una imagen aleatoria
    rotarImagenes();
    // Indicamos que cada 5 segundos cambie la imagen
    setInterval(rotarImagenes,4000);
}





