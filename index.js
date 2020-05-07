const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3005;
const users = {};
const history = {};

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
    if(!history[socket.room]){
      history[socket.room] = [];
    }
    if (io.sockets.adapter.rooms[socket.room]) {
      io.to(socket.room).emit('users', {userAmount: io.sockets.adapter.rooms[socket.room].length }); 
    }
    io.to(socket.room).emit('history', {list: history[socket.room] }); 
  });

  // app functions
  socket.on('drawing', (data) => {
    socket.broadcast.to(socket.room).emit('drawing', data);
    if(history[socket.room]){
      history[socket.room].push(data);
    }
  });
  socket.on('clear', (data) => {
    socket.broadcast.to(socket.room).emit('clear', data)
    history[socket.room] = [];
  });
  socket.on('gethistory', (data) => {
    io.to(socket.room).emit('gethistory', {list: history[socket.room] })
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



