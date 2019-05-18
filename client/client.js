let socket = io();


// let user = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
let user = prompt("Your name: ");
socket.emit("join", user); // notify server

socket.on("duplicate", function() {
    user = prompt("Duplicate name, try again: ");
    socket.emit("join", user);
    $("#input").attr('placeholder', user + ':');
});


socket.on("message", function(header, message) {
    $('#messages').append($('<li class="list-group-item">').text(header + ": " + message));
    $('#message-list').scrollTop(1E9);
});

socket.on("notify", function(message, userlist) {
    $('#messages').append($('<li class="list-group-item">').text(message));
    $('#message-list').scrollTop(1E9);
    $('#users').html(userlist.map(u => $('<li class="list-group-item">').text(u)));
});

$(document).ready(function() {
    $("#input").attr('placeholder', user + ':');
    $("form").submit(function () {
        let message = $("#input").val();
        socket.emit("message", user, message);
        $("#input").val("").focus();
        return false;
    })
});
