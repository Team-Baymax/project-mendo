var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  template: require('./TopBarTemplate'),
  
  events: {
		"click .widget-btn": "openPlanScreen"
  },
  
  initialize: function(options) {
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
  
});
