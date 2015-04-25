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
var WidgetCollection = require('./WidgetCollection');

window.widgetCollection = new WidgetCollection();

var sideNavView = new SideNavView({
  el: '#side-nav',
  EVI: EVI
});
var topBarView = new TopBarView({
  el: '#top-bar',
  collection: widgetCollection,
  EVI: EVI
});

// Swap this with all them content views
// In the beginning, set to
var mainContentView;

mainContentView = new WidgetHolderView({
  collection: widgetCollection,
  el: '#main-container',
  EVI: EVI
});

// FIXME: double init can't be good, no?
// TODO: Generate these views according to our widget state
EVI.on('openRegimenBuilder', function(){
  mainContentView.remove();
  mainContentView = new WidgetHolderView({
    collection: widgetCollection,
    el: '#main-container',
    EVI: EVI
  });
});

EVI.on('openPlanScreen', function(){
  console.log("openPlanScreen");
  mainContentView.remove();
  mainContentView = new PlanScreenView({
    collection: widgetCollection,
    el: '#main-container',
    EVI: EVI
  });
});

socket.on('addWidget', function (data){
  // EVI.emit('addWidget', data);
  widgetCollection.addWidget(data);
});
socket.on('removeWidget', function (data){
  // EVI.emit('removeWidget', data);
  widgetCollection.removeWidget(data);
});

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
