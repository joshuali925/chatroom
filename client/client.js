// let user = prompt("Your name: ");
let user = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
let socket = io();

document.title += ': ' + user;

socket.emit("join", user); // notify server

socket.on("message", function(user, message) {
    $('#messages').append($('<li class="list-group-item">').text(user + ": " + message));
    $('#message-list').scrollTop(1E9);
});

socket.on("notify", function(user, message, userlist) {
    $('#messages').append($('<li class="list-group-item">').text(message));
    $('#message-list').scrollTop(1E9);
    $('#users').html(userlist.map(u => $('<li class="list-group-item">').text(u)));
});

$(document).ready(function(){
    $("form").submit(function () {
        let message = $("#input").val();
        socket.emit("message", user, message);
        $("#input").val("").focus();
        return false;
    })
});
