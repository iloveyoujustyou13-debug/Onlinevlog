let posts = JSON.parse(localStorage.getItem("posts")) || [];
let isAdmin = false;

/* SAVE */
function save(){
localStorage.setItem("posts", JSON.stringify(posts));
}

/* POST PANEL */
function openPost(){
document.getElementById("postPanel").style.display="block";
}

function closePost(){
document.getElementById("postPanel").style.display="none";
}

/* USER ID */
function getUserId(){

let id = localStorage.getItem("uid");

if(!id){
id = "u_" + Math.random().toString(36).substr(2,9);
localStorage.setItem("uid",id);
}

return id;
}

/* PUBLISH */
function publish(){

const creator = document.getElementById("creator").value;
const title = document.getElementById("title").value;
const content = document.getElementById("content").value;
const category = document.getElementById("category").value;
const file = document.getElementById("image").files[0];

if(!creator || !title || !content || !category || !file){
alert("Fill all fields");
return;
}

const reader = new FileReader();

reader.onload = function(e){

posts.unshift({
id:Date.now(),
creator,
title,
content,
category,
image:e.target.result,
likes:[],
comments:[],
date:new Date().toDateString()
});

save();
render();

};

reader.readAsDataURL(file);

closePost();

}

/* LIKE (ONE USER ONE LIKE) */
function likePost(id){

let uid = getUserId();

posts = posts.map(p=>{

if(p.id === id){
if(!p.likes.includes(uid)){
p.likes.push(uid);
}
}

return p;
});

save();
render();

}

/* COMMENT */
function comment(id){

let input = document.getElementById("c"+id);
let text = input.value;

if(!text) return;

posts = posts.map(p=>{

if(p.id === id){
p.comments.push(text);
}

return p;
});

input.value="";
save();
render();

}

/* ADMIN LOGIN */
function openAdminLogin(){
document.getElementById("adminModal").style.display="flex";
}

function loginAdmin(){

const u = document.getElementById("adminUser").value;
const p = document.getElementById("adminPass").value;

if(u==="admin" && p==="12345"){
isAdmin = true;
document.getElementById("adminModal").style.display="none";
alert("Admin logged in");
render();
}else{
document.getElementById("adminError").innerText="Wrong credentials";
}

}

/* DELETE (ADMIN ONLY) */
function deletePost(id){

if(!isAdmin){
alert("Access denied");
return;
}

let confirmDelete = confirm("Delete this post?");

if(!confirmDelete) return;

posts = posts.filter(p=>p.id !== id);

save();
render();

}

/* RENDER */
function render(){

let feed = document.getElementById("feed");
feed.innerHTML="";

posts.forEach(p=>{

feed.innerHTML += `
<div class="article">

<h2>${p.title}</h2>
<p>${p.content}</p>

<p>👤 ${p.creator} | 📅 ${p.date}</p>

<img src="${p.image}">

<p>❤️ ${p.likes.length}</p>

<button onclick="likePost(${p.id})">Like</button>

${isAdmin ? `<button onclick="deletePost(${p.id})">Delete</button>` : ""}

<div>
<input id="c${p.id}" placeholder="Comment">
<button onclick="comment(${p.id})">Send</button>
</div>

<div>
${p.comments.map(c=>`💬 ${c}`).join("<br>")}
</div>

</div>
`;

});

}

/* INIT */
render();
