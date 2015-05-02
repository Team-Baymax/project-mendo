var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: require('./SideNavTemplatePatient'),
  
  events: {
    "click .patient-directory": "openPlanScreen"
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
  
  // Load the regimen planner into main area
  openPlanScreen: function() {
    console.log("[SideNavView] openPlanScreen");
    this.EVI.emit('openPlanScreen');
  }

});
