//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

var timelineFixer = {};

var timelineWidgetExpand = {};

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
    //timelineFixer.adjust();
}

//Expand food journal
timelineWidgetExpand.expandFoodWidget = function(e){
    $(e).find('.unexpanded-widget').addClass('hide');
    $(e).css({
        'width':'400px',
        'height': '500px',
        'cursor': 'default',
    });
    $(e).find('.expanded-widget').removeClass('hide');
}






//hide all
$(mainContainer).children().addClass('hide');

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

$('.module').click(function(){
    timelineWidgetExpand.expandFoodWidget(this);
});