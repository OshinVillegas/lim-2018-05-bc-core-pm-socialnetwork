
document.getElementById('perfil').addEventListener('click', perfil);
function perfil() {
    window.location.href = 'index.html'
}

let postKeyUpdate = '';

function writeNewPost(uid, body) {
    console.log('write');
    // A post entry.
    var postData = {
        
        uid: uid,
        body: body,
    };

    if (postKeyUpdate == '') {
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('posts').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + uid + '/' + newPostKey] = postData;
    }
    else {
        var updates = {};
        updates['/posts/' + uid + '/' + postKeyUpdate] = postData;
        postKeyUpdate = '';
    }
    firebase.database().ref().update(updates);
    return newPostKey;
}


function removePost(postkey) {
    var uid = firebase.auth().currentUser.uid;
    let path = '/posts/' + uid + '/' + postkey;
    firebase.database().ref(path).remove().then(function () {
        valposteos();
    })
        .catch(function (error) {
            console.log("ERROR PE: " + error.message)
        });

}

function editPost(postkey) {
    let uid = firebase.auth().currentUser.uid;
    let path = '/posts/' + uid + '/' + postkey;
    let promise = firebase.database().ref(path).once('value');
    promise.then(snapshot => {
        
        postKeyUpdate = postkey;
        let msg = snapshot.val().body;
        
        post.value = msg;
    })
}

let post = document.getElementById('post');
let content = document.getElementById('content');
const botonpostea = document.getElementById('botonpostea');
const div = document.createElement('div');


function valposteos() {

    while (div.firstChild) div.removeChild(div.firstChild);

    var userId = firebase.auth().currentUser.uid;
    const promesita = firebase.database().ref('/posts').once('value');
    const posteos = promesita.then(function (snapshot) {

        Object.keys(snapshot.val()).map(item => {

            const p = document.createElement('p');

            p.innerHTML = `
            <div class="w3-container w3-card w3-white w3-round w3-margin" style="width:90%;"><br>
            <div><img src="../imagenes/logoWeb.png" id="logoWeb"  style="width:30%;heigth:20%;"></div>
            <span class="w3-right w3-opacity">16 min</span>
            <div><p style="font-size:20px;"></p></div>
            <div style="font-size:20px;" id=${item}>${snapshot.val()[item].body}</div><br>
            <hr class="w3-clear">
            <button id="fb-root" data-layout="button_count" type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="far fa-thumbs-up"></i> Me Gusta</button> 
            <button id="plusone-div" type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i>  Comentar</button> 
             <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick="document.getElementById('modalsRemove').style.display='block'"><i class="far fa-trash-alt"></i>Eliminar</button>          
             <div id="modalsRemove" class="w3-modal w3-animate-zoom" onclick="this.style.display='none'">
            <div style="background:white;width:40%;margin:10% 30%;padding:30px;text-align:center;">
            <p>¿Desea Eliminar su publicación?</p>
            <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "removePost('${item}')"><i class="far fa-trash-alt"></i> SI</button>          
            <button class="w3-button w3-theme-d1 w3-margin-bottom"><i class="far fa-trash-alt"></i> NO</button>
            </div>
            </div> 
            <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick="document.getElementById('modals').style.display='block'"><i class="far fa-edit"></i>Editar</button>
            <div id="modals" class="w3-modal w3-animate-zoom" onclick="this.style.display='none'">
            <div style="background:white;width:40%;margin:10% 30%;padding:30px;text-align:center;">
            <p>¿Desea editar su publicación?</p>
            <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "editPost('${item}')"><i class="far fa-edit"></i> SI</button>
            <button class="w3-button w3-theme-d1 w3-margin-bottom"><i class="far fa-edit"></i> NO</button>
            </div>
            </div> 
        
            </div><br>`
                ;
            return div.appendChild(p)
        })
        return snapshot.val();
    });

    console.log(posteos);
}

//console.log(valposteos());
content.appendChild(div)

botonpostea.addEventListener('click', () => {
    console.log('entra al evento')

    var userId = firebase.auth().currentUser.uid;
    const newPost = writeNewPost(userId, post.value);

    valposteos();

    return 'creo';

});