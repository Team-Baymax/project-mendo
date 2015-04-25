var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  template: require('./SideNavTemplate'),
  
  events: {
    "click .patient-directory": "openRegimen"
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
  openRegimen: function() {
    console.log("[SideNavView] openRegimen");
    this.EVI.emit('openRegimenBuilder');
  }

});
