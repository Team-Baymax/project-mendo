var _ = require('underscore');
var Backbone = require('backbone');
// HACK somehow this doesn't get attached to global jquery properly
// using cdn in html for now
// require('jquery.scrollto');
Backbone.$ = $;
var PlanScreenModuleView = require('./views/PlanScreenModuleView');


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
    var that = this;
    this.$el.html(this.template());

    var timelineHTML = '';

    window.timelineData.forEach(function(timeBlock, index){
      timelineHTML += '<span class="line"></span>';
      timelineHTML += '<div class="time-row">';
      timelineHTML += ' <div class="time-container top">';
      timelineHTML += '   <p class="time">' + timeBlock.time + '</p>';
      timelineHTML += '   <div class="node"></div>';
      timelineHTML += '   <div class="line"></div>';
      timelineHTML += ' </div>';
      timelineHTML += ' <div class="module-background">';

      timeBlock.modules.forEach(function(module){
        var view = new PlanScreenModuleView({
          model: module
        });
        timelineHTML += view.$el.html();
      });
      timelineHTML += '</div>';
      timelineHTML += '</div>';
    });
    $('.modules-holder').html(timelineHTML);
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
