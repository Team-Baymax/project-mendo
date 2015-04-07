//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

var timelineFixer = {};

window.onload = init;

function init(){
    $('.btn-active').addClass('hide');
}

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
    timelineFixer.adjust();
}

//hide all
$(mainContainer).children().addClass('hide');

//adjust timeline
//take the height of the widget element 
//and apply it to the height of the time row to fix the node position.
timelineFixer.adjust = function(){
    var height;
    //height = $('.timeline-holder').height();
    //height = $('.time-row').find('.module').height();
    console.log(height);
}

//Nothing on the screen
$('.regimen').click(function(){
    PageRouter.clearMainContent();
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
    $('.btn-active').addClass('hide');
    $(this).find(".btn-active").removeClass('hide');
});
