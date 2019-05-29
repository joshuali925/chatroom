let socket = io();

let user;
// let user = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

socket.on("invalid", function () {
    setTimeout(function() { // delay to prevent double backprop
        showModal("Invalid or duplicate name, try again please");
    }, 500);
});


socket.on("message", function (display) {
    if (!user) return;
    $('#messages').append($('<li class="list-group-item">').text(display));
    $('#message-list').scrollTop(1E9);
});

socket.on("updateList", function (userlist) {
    if (!user) return;
    $('#users').html(userlist.map(u => $('<li class="list-group-item">').text(u)));
});

$(document).ready(function () {
    $("#prompt").on('shown.bs.modal', function () {
        $('#name-input').focus();
    });
    $("form").submit(function () {
        if (!user) return;
        let message = $("#input").val();
        socket.emit("message", user, message);
        $("#input").val("").focus();
        return false;
    });
    $('.submit').click(function () {
        user = $("#name-input").val().trim();
        socket.emit("join", user); // notify server
        $('.modal-backdrop').remove();
        $("#input").attr('placeholder', user + ':').focus();
    });
    showModal("Enter your name");
});

function showModal(prompt) {
    $(".modal-title").text(prompt);
    $("#name-input").val("");
    $("#prompt").modal("show");
}

$(document).on("keypress", function(event) { // enter also submits prompt
    if ($("#prompt").hasClass('in') && event.which === 13) {
        $('.submit').click();
    }
});
