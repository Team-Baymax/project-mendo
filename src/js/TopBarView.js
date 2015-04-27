var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

var TopBarWidgetButtonView = require('./TopBarWidgetButtonView');
var WidgetModel = require('./WidgetModel');

module.exports = Backbone.View.extend({
  template: require('./TopBarTemplate'),

  events: {
		"click .button": "openPlanScreen",
    "mousemove": "testMouseMove"
  },

  initialize: function(options) {
    var that = this;
    this.buttons = [];

    this.listenTo(this.collection, 'add remove', this.updateWidgetButtons);

    this.EVI = options.EVI;

    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    return this;
  },
  remove: function() {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  },
  openPlanScreen: function() {
    console.log("[TopBarView] openPlanScreen");
    this.EVI.emit('openPlanScreen');
  },
  testMouseMove: function(e) {
    console.log("testMouseMove");
    console.log(e);
  },
  updateWidgetButtons: function() {
    var that = this;
    console.log(this.$el);

    this.buttons = [];
    this.$el.find('.widget-button-contain').empty();

    this.collection.each(function(buttonModel, index){
      that.buttons.push(new TopBarWidgetButtonView({
        model : buttonModel,
        tagName: 'div',
        className: 'widget-button'
      }));
    });

    this.buttons.forEach(function(btn) {
      that.$el.find('.widget-button-contain').append(btn.$el);
    });
    this.updateWidgetCount();
  },
  updateWidgetCount: function() {
    this.$el.find('.widget-count').html(this.collection.length + ' widget' + ((this.collection.length === 1)?'':'s'));
  }

});
