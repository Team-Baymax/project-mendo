/* Control Panel */

$('.widget').on('click', selectWidget);

function selectWidget (e) {
  e.preventDefault();
  var $status = $(this).find('.status');
  $status.hasClass('active') ? $status.removeClass('active') : $status.addClass('active');
}