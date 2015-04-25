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
    // eventemitter2 events
    this.openLightbox = _.bind(this.openLightbox, this);
    this.EVI.on( 'openWidgetLightbox', this.openLightbox );
    
    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    // render widgets
    this.collection.each(function(pModel, i){
      this.addWidget(pModel);
    }, this);
    return this;
  },
  remove: function() {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  },
  addWidget: function(pModel) {
    console.log("[WidgetHolderView] addWidget");
    // We create an updating donut view for each donut that is added.
    var widgetView = new WidgetView({
      parent: '.widget-scroll',
      className: 'widget',
      model: pModel,
      EVI: this.EVI
    });
    // And add it to the collection so that it's easy to reuse.
    this.arrWidget.push(widgetView);
  },
  removeWidget: function(pModel) {
    console.log("[WidgetHolderView] removeWidget");
    var widgetView = _(this.arrWidget).filter( function(view) { return view.model === pModel; } )[0];
    widgetView.remove();
    this.arrWidget = _(this.arrWidget).without(widgetView);
  },
  openLightbox: function(data) {
    console.log("[WidgetHolderView] openLightbox");
    // TODO: For this demo we are using just one instance, 
    // therefore the model id is actually not used
    console.log(this);
    this.$el.find('.expand').addClass('active');
  },
  closeLightbox: function() {
    console.log("[WidgetHolderView] closeLightbox");
    this.$el.find('.expand').removeClass('active');
  }
  
});
