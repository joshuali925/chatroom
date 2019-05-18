let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');

let sockets = {};

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    let connected_user;
    socket.on("join", function (user) {
        if (user in sockets) {
            socket.emit("duplicate");
            return;
        }
        let now = getTime();
        sockets[user] = socket;
        connected_user = user;
        io.emit("notify", now + user + " entered the room.", Object.keys(sockets)); // notify clients
    });

    socket.on("message", function (user, message) {
        let now = getTime();
        io.emit("message", now + user, message);
    });

    socket.on("disconnect", function () {
        let now = getTime();
        delete sockets[connected_user];
        io.emit("notify", now + connected_user + " left the room.", Object.keys(sockets)); // notify clients
    });
});

http.listen(8888, function () {
    console.log('http://localhost:8888');
});

function getTime() {
    return "(" + new Date().toLocaleTimeString() + ") ";
}
