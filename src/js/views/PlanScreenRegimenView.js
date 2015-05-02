var Backbone = require('backbone');
Backbone.$ = $;

var PlanScreenRegimenOverviewView = require('./PlanScreenRegimenOverviewView');


module.exports = Backbone.View.extend({
  template: require('../templates/PlanScreenRegimenContainer'),
  initialize: function(options) {
    this.listenTo(this.collection, 'add remove', this.updateWidgetButtons);
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
  updateWidgetButtons: function() {
    console.log('updating ');
    var that = this;

    this.buttons = [];
    this.$el.find('.overview-container').empty();

    this.collection.each(function(buttonModel, index){
      that.buttons.push(new PlanScreenRegimenOverviewView({
        model : buttonModel,
        tagName: 'div',
        className: 'widget-overview'
      }));
    });

    this.buttons.forEach(function(btn) {
      that.$el.find('.overview-container').append(btn.$el);
    });
  }
});
