var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;


module.exports = Backbone.View.extend({
  template: require('./FoodJournalTemplate'),
  
  initialize: function(options) {
    // this.EVI = options.EVI;

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
    
});
