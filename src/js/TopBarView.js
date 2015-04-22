var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  template: require('./TopBarTemplate'),
  
  events: {
		
  },
  
  initialize: function(options) {
    this.EVI = options.EVI;

    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    return this;
  },
  
});
