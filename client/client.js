// let user = prompt("Your name: ");
let user = "apple";
let socket = io();

document.title += ': ' + user;


socket.emit("join", user); // notify server
socket.on("join", function (user) {
    $('#messages').append($('<li class="list-group-item">').text(user + " entered the room."));
});

socket.on("leave", function (user) {
    $('#messages').append($('<li class="list-group-item">').text(user + " left the room."));
});

socket.on("message", function(user, message) {
    addLine(user + ": " + message);
    $('#message-list').scrollTop(1E9);
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
