var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

var TopBarWidgetButtonView = require('./TopBarWidgetButtonView');
var WidgetModel = require('./WidgetModel');

module.exports = Backbone.View.extend({
  template: require('./TopBarTemplate'),

  events: {
		"click .widget-btn": "openPlanScreen"
  },

  initialize: function(options) {
    var that = this;
    this.buttons = [this.collection.length];

    this.listenTo(this.collection, 'add', this.updateWidgetButtons);

    this.EVI = options.EVI;


    console.log(this.collection, this.buttons);

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
  updateWidgetButtons: function() {
    console.log('adding widget button');
    var that = this;
    this.collection.each(function(){
      that.buttons.push(new TopBarWidgetButtonView({
        model : WidgetModel
      }));
    });
  }

});
