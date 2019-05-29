let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');

let sockets = {};
let args = process.argv.slice(2);
let port = args.length > 0 ? parseInt(args[0]) : 8888;

let history = [];

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function () {
    console.log('http://localhost:' + port);
});

function getTime() {
    return "(" + new Date().toLocaleTimeString() + ") ";
}

io.on('connection', function (socket) {
    let connected_user;
    socket.on("join", function (user) {
        if (!user || user in sockets) {
            socket.emit("invalid");
            return;
        }
        sockets[user] = socket;
        connected_user = user;
        history.forEach(h => socket.emit("message", h));
        let display = getTime() + user + " entered the room.";
        history.push(display);
        console.log(display);
        io.emit("message", display);
        io.emit("updateList", Object.keys(sockets)); // notify clients
    });

    socket.on("message", function (user, message) {
        let display = getTime() + user + ": " + message;
        history.push(display);
        console.log(display);
        io.emit("message", display);
    });

    socket.on("disconnect", function () {
        if (!connected_user) return;
        delete sockets[connected_user];
        let display = getTime() + connected_user + " left the room.";
        history.push(display);
        console.log(display);
        io.emit("message", display);
        io.emit("updateList", Object.keys(sockets)); // notify clients
    });
});
