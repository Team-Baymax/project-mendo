var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  template: require('./sideNavTemplate'),
  
  events: {
    "click .regimen": "openRegimen"
  },
  
  initialize: function(options) {
    // this.EVI = options.EVI;

    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    return this;
  },
  
  // Load the regimen planner into main area
  openRegimen: function() {
    console.log("[sidenavView] openRegimen");
    // TODO: Use eventemitter to let main load in the regimen planner
  }

});
