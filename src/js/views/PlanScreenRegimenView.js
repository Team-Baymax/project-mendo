var Backbone = require('backbone');
Backbone.$ = $;

var PlanScreenRegimenOverviewView = require('./PlanScreenRegimenOverviewView');


module.exports = Backbone.View.extend({
  template: require('../templates/PlanScreenRegimenContainer'),
  initialize: function(options) {
    this.listenTo(this.collection, 'add remove', this.updateWidgetOverviews);
    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    this.updateWidgetOverviews();
    return this;
  },
  remove: function() {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  },
  updateWidgetOverviews: function() {
    var that = this;

    this.overviews = [];
    this.$el.find('.overview-container').empty();

    this.collection.each(function(buttonModel, index) {
      that.overviews.push(new PlanScreenRegimenOverviewView({
        model : buttonModel,
        tagName: 'div',
        className: 'widget-overview'
      }));
    });

    console.log('hello');
    this.overviews.forEach(function(btn) {
      that.$el.find('.overview-container').append(btn.$el);
    });
  }
});
