var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');
var WidgetModel = require('./WidgetModel');
var WidgetView = require('./WidgetView');
var WidgetTemplate = require('./WidgetTemplate');

module.exports = Backbone.View.extend({
  template: require('./WidgetHolderTemplate'),
  
  initialize: function(options) {
    this.EVI = options.EVI;
    // Array for widget views
    this.arrWidget = []; // [PIRATE]
    // Listen to collection change to update view
    this.listenTo( this.collection, 'add', this.addWidget );
    this.listenTo( this.collection, 'remove', this.removeWidget );
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
  addWidget: function(pModel) {
    // trying model => view thing
    // var widgetModel = new WidgetModel();
    // var foodWidget = new WidgetView({
    //   el: '.widget-scroll',
    //   model: widgetModel
    // });
    console.log("[WidgetHolderView] addWidget");
    // We create an updating donut view for each donut that is added.
    var widgetView = new WidgetView({
      parent: '.widget-scroll',
      className: 'widget',
      model: pModel
    });
    // And add it to the collection so that it's easy to reuse.
    this.arrWidget.push(widgetView);
    //  
    // If the view has been rendered, then
    // we immediately append the rendered donut.
    
    //     if (this._rendered) {
    //       $(this.el).append(dv.render().el);
    //     }
    
  },
  removeWidget: function(pModel) {
    console.log("[WidgetHolderView] removeWidget");
    var widgetView = _(this.arrWidget).filter( function(view) { return view.model === pModel; } )[0];
    widgetView.remove();
    this.arrWidget = _(this.arrWidget).without(widgetView);
  }
  
});
