var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');
var WidgetModel = require('./WidgetModel');
var WidgetView = require('./WidgetView');

module.exports = Backbone.View.extend({
  template: require('./WidgetHolderTemplate'),
  
  initialize: function(options) {
    this.EVI = options.EVI;
    this.EVI.on('addWidget', this.addWidget);
    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    return this;
  },
  addWidget: function(data) {
    // trying model => view thing
    var widgetModel = new WidgetModel();
    var foodWidget = new WidgetView({
      el: '.widget-scroll',
      model: widgetModel
    });
  },
  removeWidget: function(data) {
    
  }
  
});
