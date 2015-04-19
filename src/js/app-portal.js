/**
 * Entry point for Doctor / Patient Portal
 */
console.log("**Doctor / Patient Portal**");

var $ = require('jquery');
var socket = require('socket.io-client')();

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
  $('.expand').addClass('active');
}

widgetExpand.deflate = function(){
  $('.expand').removeClass('active');
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
  console.log("$('.food-journal').click");
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

socket.on('button clicked', function (data){
  console.log(data);
  $widget = $('.widget.' + data);
  // if object does not exist, create it
  if ( $widget.length === 0) {
    // add the new html
    var $html = $( createWidget(data) );

    $('.widget-scroll').append( $html );
    // * TODO Refactor. This is spaghetti
    $html.click(function(){
      widgetExpand.expand();
    });
    // add the active class to animate in
    // * FIXME: For some reason
    // * the animation is broken
    // * when you call addClass alone.
    // * Wrapping it in the setTimeout
    // * should be just a temporary fix
    setTimeout(function(){
      $('.widget.' + data).addClass('active');
    }, 1);
  // else remove it
  } else {
    $widget.removeClass('active'); //begin the animation
    // delay by 300ms before removing
    setTimeout(function(){
      $widget.remove();
    }, 300);
  }
});
  
function createWidget (name) {
  var html = '';
  switch (name) {
    case 'food':
      html = '<div class="widget food"> <div class="widget-bg food-journal"> <div class="icon"></div> <div class="content"> <h1>Food Journal</h1> <p class="tags">Food Log, Calorie Counter, Personalized Plan</p> <p class="description">Personalize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.</p> </div> <div class="status"> <div class="ball"></div> <p>Personalize your tracker</p> </div> </div> </div>';
      break;

    case 'bloodPressure':
      html = '<div class="widget bloodPressure" name="bloodPressure"> <div class="widget-bg blood-pressure"> <div class="icon"></div> <div class="content"> <h1>Blood Pressure</h1> <p class="tags">Food Log, Calorie Counter, Personalized Plan</p> <p class="description">Personalize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.</p> </div> <div class="status"> <div class="ball"></div> <p>Personalize your tracker</p> </div> </div> </div> ';
      break;

    default:
      break;
  }
  
  // $(html).click(function(){
  //   console.log("$('.food-journal').click");
  //   widgetExpand.expand();
  // });

  // $('.background-black').click(function(){
  //   widgetExpand.deflate();
  // })
  return html;
}

// Insert Leap Here
var leapController = new Leap.Controller({
  enableGestures: true
});
leapController.use('boneHand', {
  targetEl: document.querySelector("#handModel-holder"),
  arm: true
 });
leapController.use('screenPosition');

leapController.on('connect', function() {
  console.log("Successfully connected.");
});

leapController.on('deviceStreaming', function() {
  console.log("A Leap device has been connected.");
});

leapController.on('deviceStopped', function() {
  console.log("A Leap device has been disconnected.");
});

leapController.connect();
