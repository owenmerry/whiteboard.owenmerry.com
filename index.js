const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3004;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});

app.get('/room/', (req, res) => {
  res.redirect('/');
});

app.get('/room/:room', (req, res) => {
  res.sendFile(__dirname + '/public/whiteboard.html');
});



function onConnection(socket){

  //watch list

  //connect to room
  socket.on('room', (data) => {
    socket.join(data.room);
    socket.room = data.room;
    if (io.sockets.adapter.rooms[socket.room]) {
      io.to(socket.room).emit('users', {userAmount: io.sockets.adapter.rooms[socket.room].length }); 
    }
  });

  // app functions
  socket.on('drawing', (data) => {
    socket.broadcast.to(socket.room).emit('drawing', data);
  });
  socket.on('clear', (data) => {
    socket.broadcast.to(socket.room).emit('clear', data)
  });

  //user disconnected
  socket.on('disconnect', () => {
    if (io.sockets.adapter.rooms[socket.room]) {
      io.to(socket.room).emit('users', {userAmount: io.sockets.adapter.rooms[socket.room].length});
    }
  });
}
io.on('connection', onConnection);


http.listen(port, () => console.log('listening on port ' + port));



