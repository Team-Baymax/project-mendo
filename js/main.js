//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

PageRouter.clearMainContent = function(){
    $(mainContainer).children().addClass('hide');
}

//First screen
PageRouter.loadFirstScreen = function(){
    $('.text').removeClass('hide');
}

//Second Screen
PageRouter.loadWidgetScreen = function(){
    $('.widget-holder').removeClass('hide');
}

//Plan Screen
PageRouter.loadPlanScreen = function(){
    $('.plan-screen').removeClass('hide');
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

$('.widget-btn').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadPlanScreen();
});

$('.btn').click(function(){
    $(this).find('.btn-active').css('visibility', 'hidden');
    $(this).find(".btn-active").css("visibility","visible");
});
