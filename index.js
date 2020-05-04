var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var users = 0;

//routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
  });

//socket
io.on('connection', (socket) => {
    users++;
    socket.broadcast.emit('chat message', 'shh.. someone has entered the room ( '+ users +' users online now)');
    console.log('a user connected (users'+ users +')');
    io.emit('chat message', 'New user has joined the chat ( '+ users +' users online now)');
    socket.on('disconnect', () => {
        users--;
        console.log('user disconnected (users'+ users +')');
        io.emit('chat message', 'A user disconnected from the chat ( '+ users +' users online now)');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
  });

//server
http.listen(3002, () => {
  console.log('listening on *:3002');
});