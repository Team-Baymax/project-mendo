//Global elements
var mainContainer = $(".main-container");

var PageRouter = {};

var widgetExpand = {};

var timelineWidgetExpand = {};

var selectedWidgets = [];

window.onload = init;

function init(){
    $('.btn-active').addClass('hide');
}

PageRouter.clearMainContent = function(){
    $(mainContainer).children().addClass('hide');
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

widgetExpand.expand = function(){
  $('.food-journal').parent().css({
    'position':'initial',
  })
  //$('.food-journal').children().addClass('hide');
  $('.food-journal').parent().find('.expand').css({
    //'background-image':'inherit',
    //'position':'absolute',
    'top':'50%',
    'left':'50%',
    'transform':'translate(-50%, -50%)',
    'height':'100%',
    'width':'100%',
    'opacity':'1',
  })
}

widgetExpand.deflate = function(){
  $('.food-journal').parent().css({
    'position':'relative',
  })
  //$('.food-journal').children().addClass('hide');
  $('.food-journal').parent().find('.expand').css({
    //'background-image':'inherit',
    'position':'absolute',
    'top':'50%',
    'left':'50%',
    'transform':'translate(-50%, -50%)',
    'height':'50%',
    'width':'50%',
    'opacity':'0',
  })
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

$('.food-journal').click(function(){
  widgetExpand.expand();
});

$('.background-black').click(function(){
  widgetExpand.deflate();
})

$('.widget-btn').click(function(){
    PageRouter.clearMainContent();
    PageRouter.loadPlanScreen();
});

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

var socket = io();

socket.on('button clicked', function (data){
  console.log(data);
});
