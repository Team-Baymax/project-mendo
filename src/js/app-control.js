/**
 * Entry point for Control Panel
 */
console.log("**Control Panel**");

var $ = require('jquery');
var socket = require('socket.io-client')();

$('.widget').on('click', selectWidget);

function selectWidget (e) {
  e.preventDefault();
  if ( $(this).hasClass('active') ) {
    $(this).removeClass('active');
    socket.emit('removeWidget', $(this).attr('name'));
  } else {
    $(this).addClass('active');
    socket.emit('addWidget', $(this).attr('name'));
  }
}

$('.btn-reload').on('click', emitReload);

function emitReload (e) {
  e.preventDefault();
  socket.emit('reload');
}

socket.on('reload', function(){
  window.location.reload();
});
