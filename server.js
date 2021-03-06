const { BlockChain } = require('./blockchain');

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');

let sockets = {};
let args = process.argv.slice(2);
let port = args.length > 0 ? parseInt(args[0]) : 8888;

let history = [];
let chain = new BlockChain();

// serve client js and css
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
    socket.on("join", function (user) { // a new username created
        if (!user || user in sockets) {
            socket.emit("invalid"); // invalid or duplicate name
            return;
        }
        sockets[user] = socket;
        connected_user = user;
        history.forEach(h => socket.emit("message", h)); // sends history to the new user
        emitMessage(null, getTime() + user + " entered the room.");
        io.emit("updateList", Object.keys(sockets)); // sync userlist to all users
    });

    socket.on("message", function (user, message) { // the user sends a message
        emitMessage(getTime() + user + ': ', message);
    });

    socket.on("disconnect", function () { // the user left
        if (!connected_user) return; // in case never created username
        delete sockets[connected_user];
        emitMessage(null, getTime() + connected_user + " left the room.");
        io.emit("updateList", Object.keys(sockets)); // sync userlist to all users
    });
});

function emitMessage(header, message) { // header = (time) username
    let display = {};
    display.type = header ? "message" : "notification";
    display.header = header;
    display.text = message;
    history.push(display);
    console.log(display);
    io.emit("message", display);
    chain.addBlock(new Date().getTime(), display);
}
