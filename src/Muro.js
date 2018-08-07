
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
    const promesita = firebase.database().ref('/posts').child(userId).once('value');

    const posteos = promesita.then(function (snapshot) {

        Object.keys(snapshot.val()).map(item => {

            const p = document.createElement('p');

            p.innerHTML = `
             <div class="w3-card w3-round w3-white">
              <div class="w3-container w3-padding">
                    <p>${snapshot.val()[item].uid}</p>
                    <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
                    <div id='prof' class="w3-left w3-circle w3-margin-right" style="width:60px"></div>
                    <span class="w3-right w3-opacity">16 min</span>
                    <div id=${item}>${snapshot.val()[item].body}</div><br>
                    <hr class="w3-clear">
                    <button id="fb-root" data-layout="button_count" type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="far fa-thumbs-up"></i> Me Gusta</button> 
                    <button id="plusone-div" type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i>  Comentar</button> 
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "removePost('${item}')"><i class="far fa-trash-alt"></i>Elimina</button>           
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "editPost('${item}')"><i class="far fa-edit"></i> Editar</button>
                    </div> 
                    </div><br>
                    </div>
                    </div>`
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

    /*     const p = document.createElement('p');
    
        p.innerHTML = content.innerHTML += `
                    
                        <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
                        <div id='prof' class="w3-left w3-circle w3-margin-right" style="width:60px"></div>
                        <span class="w3-right w3-opacity">16 min</span>
                        <div id=id=${newPost}>${post.value}</div><br>
                        <hr class="w3-clear">
                        <button id="fb-root" data-layout="button_count" type="button" class="w3-button w3-theme-d1 w3-margin-bottom"><i class="far fa-thumbs-up"></i> Me Gusta</button> 
                        <button id="plusone-div" type="button" class="w3-button w3-theme-d2 w3-margin-bottom"><i class="fa fa-comment"></i>  Comentar</button> 
                        <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "eliminar()"><i class="far fa-trash-alt"></i>Elimina</button>           
                        <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "editar()"><i class="far fa-edit"></i> Editar</button>
                        </div> 
                        </div><br>`
            ; */
    return 'creo';

});