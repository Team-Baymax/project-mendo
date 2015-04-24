var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  template: require('./WidgetTemplate'),
  
  initialize: function(options) {
    this.EVI = options.EVI;
    
    return this.render();
  },
  render: function() {
    this.$el.append(this.template(this.model.attributes));
    return this;
  },
  remove: function() {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  },
  
});
