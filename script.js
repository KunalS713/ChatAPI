
var socket = io();
socket.addEventListener("chat", addChat)
document.querySelector(() => {
    getChats();

    document.querySelector("#send").click(() => {
        var chatMessage = {
            name: document.querySelector("#txtName").value, chat: document.querySelector("#txtMessage").value
        }
        postChat(chatMessage);
    })
})

function postChat(chat) {
    $.post("http://localhost:8000/chats", chat);
}

function getChats() {
    $.get("/chats", (chats) => {
        chats.forEach(addChat);
    })
}

function addChat(chatObj) {
    document.querySelector("#messages").insertAdjacentHTML("beforeend",`<h5>${chatObj.name} </h5><p>${chatObj.chat}</p>`);
}

function deleteChat(chatObj){
    document.querySelector("#messages").insertAdjacentElement("beforebegin",'');
}