// let user = prompt("Your name: ");
let user = "apple";
let socket = io();
socket.emit("join", user); // notify server

document.title += ': ' + user;


socket.on("join", function (user) {
    $('#messages').append($('<li class="list-group-item">').text(user + " entered the chatroom."));
});

socket.on("message", function(user, message) {
    addLine(user + ": " + message);
});

function addLine(text) {
    $('#messages').append($('<li class="list-group-item">').text(text));
}

$(document).ready(function(){
    $("form").submit(function () {
        let message = $("#input").val();
        socket.emit("message", user, message);
        $("#input").val("").focus();
        return false;
    })
});
