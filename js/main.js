//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

//First screen
PageRouter.loadFirstScreen = function(){
    $('.text').removeClass('hide');
}

PageRouter.clearMainContent = function(){
    $(mainContainer).children().addClass('hide');
}

//Second Screen
PageRouter.loadWidgetScreen = function(){
    /*var widgetHolder = $(div);
    widgetHolder.addClass("widget-holder");*/
    $('.widget-holder').removeClass('hide');
}

//hide all
$(mainContainer).children().addClass('hide');

//Nothing on the screen
$('.regimen').click(function(){
    PageRouter.loadFirstScreen();
});

$('.text-two').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadWidgetScreen();
});

$('.btn').click(function(){
    $(this).find('.btn-active').css('visibility', 'hidden');
    $(this).find(".btn-active").css("visibility","visible");
});
