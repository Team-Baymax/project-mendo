//Global elements
var mainContainer = $(".main-container");

//hide all
$(mainContainer).children().addClass('hide');

//Nothing on the screen
$('.regimen').click(function(){
    loadFirstScreen();
});

//First screen
function loadFirstScreen(){
    $('.text').removeClass('hide');
}

$('.text-two').click(function(){
    clearMainContent();
    loadWidgetScreen();
});

$('.btn').click(function(){
    $('.btn').find('.btn-active').css('visibility', 'hidden');
    $(this).find(".btn-active").css("visibility","visible");
});

function clearMainContent(){
    $(mainContainer).children().addClass('hide');
}

//Second Screen
function loadWidgetScreen(){
    /*var widgetHolder = $(div);
    widgetHolder.addClass("widget-holder");*/
    $('.widget-holder').css('display', 'block');
}