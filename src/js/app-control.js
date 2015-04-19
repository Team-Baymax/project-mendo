/**
 * Entry point for Control Panel
 */
console.log("**Control Panel**");

var $ = require('jquery');
var socket = require('socket.io-client')();

$('.widget').on('click', selectWidget);

function selectWidget (e) {
  e.preventDefault();
  $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
  socket.emit('button clicked', $(this).attr('name'));
}
