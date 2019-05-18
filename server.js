let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');

let sockets = [];

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    let username;
    socket.on("join", function (user) {
        sockets[user] = socket;
        username = user;
        io.emit("join", user); // notify clients
        console.log(user + " connected.");
    });

    socket.on("message", function (user, message) {
        io.emit("message", user, message);
    });

    socket.on("disconnect", function() {
        delete sockets[user];
        io.emit("leave", username);
        console.log(username + " left.");
    });
});

http.listen(8888, function(){
    console.log('listening on port 8888');
});
