/* Control Panel */

var socket = io();

$('.widget').on('click', selectWidget);

function selectWidget (e) {
  e.preventDefault();
  var $status = $(this).find('.status');
  $status.hasClass('active') ? $status.removeClass('active') : $status.addClass('active');
  socket.emit('button clicked', $(this).find('.title').html());
}
