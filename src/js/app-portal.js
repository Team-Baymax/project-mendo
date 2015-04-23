/**
 * Entry point for Doctor / Patient Portal
 * Serves as page router also
 * [TENTATIVE TODO] Put router into its own module?
 */
console.log("**Doctor / Patient Portal**");

var $ = require('jquery');
var Backbone = require('backbone');
var socket = require('socket.io-client')();
Backbone.$ = $;

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var EVI = new EventEmitter2();

// Assemble the views
var SideNavView = require('./SideNavView');
var TopBarView = require('./TopBarView');

// Views that go into main content view
var PlanScreenView = require('./PlanScreenView');
var WidgetHolderView = require('./WidgetHolderView');

var WidgetView = require('./WidgetView');
var WidgetModel = require('./WidgetModel');

var sideNavView = new SideNavView({
  el: '#side-nav',
  EVI: EVI
});
var topBarView = new TopBarView({
  el: '#top-bar',
  EVI: EVI
});

// Swap this with all them content views
var mainContentView;
// FIXME: double init can't be good, no?
// TODO: Generate these views according to our widget state
EVI.on('openRegimenBuilder', function(){
  mainContentView = new WidgetHolderView({
    el: '#main-container',
    EVI: EVI
  });
});

EVI.on('openPlanScreen', function(){
  mainContentView = new PlanScreenView({
    el: '#main-container',
    EVI: EVI
  });
});

socket.on('button clicked', function (data){
  EVI.emit('addWidget', data);
    
  // [CHANGBAI] instead of checking the dom element's existence
  // check if it's active in the widget collection
  // Thus, .food won't be necessary
  // event listen/handle should be handled by views themselves
  
  
  // $widget = $('.widget.' + data);
  // if object does not exist, create it
  // if ( $widget.length === 0) {
  //   // add the new html
  //   var $html = $( createWidget(data) );
  // 
  //   $('.widget-scroll').append( $html );
  //   // * TODO Refactor. This is spaghetti
  //   $html.click(function(){
  //     widgetExpand.expand();
  //   });
  //   // add the active class to animate in
  //   // * FIXME: For some reason
  //   // * the animation is broken
  //   // * when you call addClass alone.
  //   // * Wrapping it in the setTimeout
  //   // * should be just a temporary fix
  //   setTimeout(function(){
  //     $('.widget.' + data).addClass('active');
  //   }, 1);
  // // else remove it
  // } else {
  //   $widget.removeClass('active'); //begin the animation
  //   // delay by 300ms before removing
  //   setTimeout(function(){
  //     $widget.remove();
  //   }, 300);
  // }
});
  
function createWidget (name) {
  var html = '';
  switch (name) {
    case 'food':
      html = '<div class="widget food-journal"> <div class="widget-bg"> <div class="icon"></div> <div class="content"> <h1>Food Journal</h1> <p class="tags">Food Log, Calorie Counter, Personalized Plan</p> <p class="description">Personalize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.</p> </div> <div class="status"> <div class="ball"></div> <p>Personalize your tracker</p> </div> </div> </div>';
      break;

    case 'bloodPressure':
      html = '<div class="widget blood-pressure"> <div class="widget-bg blood-pressure"> <div class="icon"></div> <div class="content"> <h1>Blood Pressure</h1> <p class="tags">Food Log, Calorie Counter, Personalized Plan</p> <p class="description">Personalize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.</p> </div> <div class="status"> <div class="ball"></div> <p>Personalize your tracker</p> </div> </div> </div> ';
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


// Legacy code

var mainContainer = $(".main-container");

var widgetExpand = {};

var timelineWidgetExpand = {};

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
    'height':'137px',
    'cursor':'pointer',
  });
  $('.module').find('.unexpanded-widget').removeClass('hide');
}

$('.food-journal').click(function(){
  console.log("$('.food-journal').click");
  widgetExpand.expand();
});

$('.background-black').click(function(){
  widgetExpand.deflate();
})

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
