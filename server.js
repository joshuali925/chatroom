let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');

let sockets = {};

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    let connected_user;
    socket.on("join", function (user) {
        sockets[user] = socket;
        connected_user = user;
        io.emit("notify", user, user + " entered the room.", Object.keys(sockets)); // notify clients
        // console.log(user + " connected.");
    });

    socket.on("message", function (user, message) {
        io.emit("message", user, message);
    });

    socket.on("disconnect", function() {
        delete sockets[connected_user];
        io.emit("notify", connected_user, connected_user + " left the room.", Object.keys(sockets)); // notify clients
        // console.log(connected_user + " disconnected.");
    });
});

http.listen(8888, function(){
    console.log('listening on port 8888');
});
