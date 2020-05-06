const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3004;
//const room1 = io.of('/room1');
//const room2 = io.of('/room2');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/chat/:room', (req, res) => {
  res.sendFile(__dirname + '/public/draw.html');
});



function onConnection(socket){

  // join room socket.join('some room');
  const room = 'room1';
  //const room = req.params.room;
  socket.join(room);
  socket.room = room;

  //user connected
  io.emit('users', {userAmount: io.engine.clientsCount});

  //watch list
  socket.on('room', (data) => {
    //socket.leave(socket.room);
    socket.join(data.room);
    socket.room = data.room;
    console.log(`joined room:${data.room}`);
  });
  socket.on('drawing', (data) => socket.broadcast.to(socket.room).emit('drawing', data));
  socket.on('clear', (data) => socket.broadcast.to(socket.room).emit('clear', data));

  //user disconnected
  socket.on('disconnect', () => {
    io.emit('users', {userAmount: io.engine.clientsCount});
  });
}
io.on('connection', onConnection);


http.listen(port, () => console.log('listening on port ' + port));