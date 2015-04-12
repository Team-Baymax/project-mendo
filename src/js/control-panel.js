/* Control Panel */

var socket = io();

$('.widget').on('click', selectWidget);

function selectWidget (e) {
  e.preventDefault();
  $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
  socket.emit('button clicked', $(this).attr('name'));
}
