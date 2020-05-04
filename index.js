const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3004;
let onlineUsers = 0;

app.use(express.static(__dirname + '/public'));

function onConnection(socket){

  //user connected
  onlineUsers++;
  io.emit('users', {userAmount: onlineUsers});

  //watch list
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  socket.on('clear', (data) => socket.broadcast.emit('clear', data));

  //user disconnected
  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('users', {userAmount: onlineUsers});
  });
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));