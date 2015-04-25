var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

var TopBarWidgetButtonView = require('./TopBarWidgetButtonView');
var WidgetModel = require('./WidgetModel');
var TopBarExpandedView = require('./TopBarExpandedView');

module.exports = Backbone.View.extend({
  template: require('./TopBarTemplate'),

  events: {
		"click .button": "openPlanScreen",
    "mouseenter .widget-button-contain": "openExpandedView",
  },

  initialize: function(options) {
    var that = this;
    this.buttons = [];

    this.listenTo(this.collection, 'add remove', this.updateWidgetButtons);

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
  openPlanScreen: function() {
    console.log("[TopBarView] openPlanScreen");
    this.EVI.emit('openPlanScreen');
  },
  updateWidgetButtons: function() {
    var that = this;
    console.log(this.$el);

    this.buttons = [];
    this.$el.find('.widget-button-contain').empty();

    this.collection.each(function(buttonModel, index){
      that.buttons.push(new TopBarWidgetButtonView({
        model : buttonModel,
        tagName: 'div',
        className: 'widget-button'
      }));
    });

    this.buttons.forEach(function(btn) {
      that.$el.find('.widget-button-contain').append(btn.$el);
    });
    this.updateWidgetCount();
  },
  updateWidgetCount: function() {
    this.$el.find('.widget-count').html(this.collection.length + ' widget' + ((this.collection.length === 1)?'':'s'));
  },
  openExpandedView: function() {
    var that = this;

    // NOTE: is(:empty) will return false even if its just a line break
    if (! this.$el.find('.widget-button-contain').is(':empty')) {
      this.$el.parent().find('#main-container').append(new TopBarExpandedView({
        collection: that.collection,
        tagName: 'div',
        className: 'top-bar-expanded-container'
      }).$el);
    }

    this.$el.parent().find('#main-container').find('.top-bar-expanded-container').on('mouseleave', that.closeExpandedView);
  },
  closeExpandedView: function() {
    // FIXME: should only be removed at certain times
    Backbone.$('#main-container').find('.top-bar-expanded-container').remove().off('mouseleave');;
  }
});
