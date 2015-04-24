// Socket Demo | Server

var express = require('express');
var path = require('path');
var app = express(); // the main app
var http = require('http').Server(app);
var io = require('socket.io')(http);

var root = '../build';

app.use(express.static(path.join(__dirname, root)));

// Socket Setup
io.on('connection', function(socket){
  console.log("user connected");
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('addWidget', function(data){
    console.log('Button ID: ' + data);
    // Send that to view
    // socket.broadcast.emit send it to all connected clients except this one
    socket.broadcast.emit('addWidget', data);
  });
  socket.on('removeWidget', function(data){
    console.log('Button ID: ' + data);
    // Send that to view
    // socket.broadcast.emit send it to all connected clients except this one
    socket.broadcast.emit('removeWidget', data);
  });
  socket.on('mouse move', function(data){
    socket.broadcast.emit('mouse move', data);
  });
})

http.listen(5000, function(){
  console.log('listening on *:5000');
});
