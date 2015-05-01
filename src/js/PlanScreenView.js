var _ = require('underscore');
var Backbone = require('backbone');
// HACK somehow this doesn't get attached to global jquery properly
// using cdn in html for now
// require('jquery.scrollto');
Backbone.$ = $;


module.exports = Backbone.View.extend({
  template: require('./PlanScreenTemplate'),
  
  events: {
    "fistMove": "scrollTimeline"
  },
  
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
  
  scrollTimeline: function(e, data) {
    if (data.direction == 'up')
      // this.$el.find('.timeline-holder').scrollTo('-=' + data.amount + 'px', {axis: 'y'});
      $('.timeline-holder').scrollTo('-=' + data.amount + 'px', {axis: 'y'});
    if (data.direction == 'down')
      $('.timeline-holder').scrollTo('+=' + data.amount + 'px', {axis: 'y'});
  }
  
});
