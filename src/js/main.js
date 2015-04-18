//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

var timelineFixer = {};

var timelineWidgetExpand = {};

var selectedWidgets = [];

window.onload = init;

function init(){
    $('.btn-active').addClass('hide');
}

PageRouter.clearMainContent = function(){
    $(mainContainer).children().addClass('hide');
}

//First screen


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

timelineWidgetExpand.search = function(e){
    //$(e).parent().removeClass('hide');
    $(e).parent().parent().find('.list').removeClass('hide');
    //console.log($(e).find('.list'));
}

timelineWidgetExpand.close = function(){
    /*$(e).closest('.expanded-widget').addClass('hide');
    $(e).closest('.expanded-widget').find('.list').addClass('hide');
    $(e).parent().parent().css({
        'width':'296px',
        'height':'160px',
        'cursor':'pointer',
    });
    $(e).closest('.module').find('.unexpanded-widget').removeClass('hide');*/
    $('.expanded-widget').addClass('hide');
    $('.expanded-widget').find('.list').addClass('hide');
    $('.module').css({
        'width':'296px',
        'height':'160px',
        'cursor':'pointer',
    });
    $('.module').find('.unexpanded-widget').removeClass('hide');
}






//hide all
$(mainContainer).children().addClass('hide');

//Nothing on the screen
$('.regimen').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadWidgetScreen(this);
});

$('.text-two').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadWidgetScreen();
});

$('.widget-btn').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadPlanScreen();
});

/*$('.btn').click(function(){
    $('.btn-active').addClass('hide');
    $(this).find(".btn-active").removeClass('hide');
});*/

$('.module').click(function(){
    timelineWidgetExpand.close();
    timelineWidgetExpand.expandFoodWidget(this);
});

$('.searchbox').click(function(){
    timelineWidgetExpand.search(this);
});

$('.cancel').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    timelineWidgetExpand.close(this);
});




//Key press for demo!!!!!
$(document).keypress(function(e) {
  if(e.which == 49) {
    //alert('yo');
    $('<div class="widget foodJournal"><div class="icon"></div><div class="content"><h1>Food Journal</h1><p class="tags">Food Log, Calorie Counter, Personalized Plan</p><p class="description">Personalize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.</p></div></div>').appendTo('.widget-scroll');
    selectedWidgets = "foodJournal";
    //console.log(selectedWidgets);
  }
  
  else if(e.which == 50){
    $('<div class="widget bloodPressure"><div class="icon"></div><div class="content"><h1>Blood Pressure</h1><p class="tags">Monitor and record blood pressure reading</p><p class="description">Track your blood pressure to help work towards a lower blood pressure to lower the risk of heart diseases, stroke and other problems.</p></div></div>').appendTo('.widget-scroll');
    selectedWidgets = "bloodPressure";
  }
});

var socket = io();

socket.on('button clicked', function (data){
  console.log(data);
});
