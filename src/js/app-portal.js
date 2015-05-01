/**
 * Entry point for Doctor / Patient Portal
 * Serves as page router also
 * [TENTATIVE TODO] Put router into its own module?
 */
console.log("**Doctor / Patient Portal**");

var Backbone = require('backbone');
var socket = require('socket.io-client')();
Backbone.$ = $;

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var EVI = new EventEmitter2();

// global patient object
var Patient = require('./models/PatientModel');
window.Patient = new Patient();

// Assemble the views
window.LeapGesture = require('./LeapGesture');
var SideNavView = require('./SideNavView');
var TopBarView = require('./TopBarView');

// Views that go into main content view
var PlanScreenView = require('./PlanScreenView');
var WidgetHolderView = require('./WidgetHolderView');
var FoodJournalView = require('./FoodJournalView');

var WidgetView = require('./WidgetView');
var WidgetModel = require('./WidgetModel');
var WidgetCollection = require('./WidgetCollection');

LeapGesture.init();

window.widgetCollection = new WidgetCollection();

var TimelineCollection = require('./models/TimelineCollection');
window.timelineCollection = new TimelineCollection();

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
    collection: timelineCollection,
    el: '#main-container',
    EVI: EVI
  });
});

EVI.on('openFoodJournal', function(){
  console.log("openFoodJournal");
  mainContentView.remove();
  mainContentView = new FoodJournalView({
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
