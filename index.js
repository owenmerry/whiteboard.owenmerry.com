const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3004;

app.use(express.static(__dirname + '/public'));

function onConnection(socket){

  //user connected
  io.emit('users', {userAmount: io.engine.clientsCount});

  //watch list
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  socket.on('clear', (data) => socket.broadcast.emit('clear', data));

  //user disconnected
  socket.on('disconnect', () => {
    io.emit('users', {userAmount: io.engine.clientsCount});
  });
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));