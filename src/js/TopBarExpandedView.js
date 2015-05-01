var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var TopBarExpandedWidgetButton = require('./TopBarExpandedWidgetButtonView');

module.exports = Backbone.View.extend({
  template: require('./TopBarExpandedTemplate'),

  initialize: function(options) {
    this.EVI = options.EVI;
    this.listenTo(this.collection, 'add remove', this.updateWidgetButtons);
    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    this.updateWidgetButtons();
    return this;
  },
  updateWidgetButtons: function() {
    var that = this;
    this.$el.find('.expanded-button-contain').empty();
    this.collection.each(function(widgetModel, index) {
      that.$el.find('.expanded-button-contain').append(new TopBarExpandedWidgetButton({
        model: widgetModel,
        tagname: 'div',
        className: 'expanded-widget-button'
      }).$el );
    });
  }
});
