// Socket Demo | Server

var express = require('express');
var path = require('path');
var app = express(); // the main app
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

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
  socket.on('reload', function(){
    socket.broadcast.emit('reload');
  });
})

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000  
http.listen(port, function() {  
  console.log("Express server listening on port " + http.address().port);
});
