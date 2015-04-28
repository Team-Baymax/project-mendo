// HACK: owlslider attaches itself to the global jquery object,
// forcing us to have a global one outside the context of browserify.
// Have to use the global $ to get that element
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');
var WidgetModel = require('./WidgetModel');
var WidgetView = require('./WidgetView');
var WidgetTemplate = require('./WidgetTemplate');
var FoodJournalModel = require('./models/FoodJournalModel');

module.exports = Backbone.View.extend({

  foodJournalResponses: null,

  template: require('./WidgetHolderTemplate'),

  events: {
    "click .lightbox-bg": "closeLightbox",
    "click .btn-next": "nextSlide",
    "click .btn-back": "backSlide",
    "click [data-answer]": "selectFoodJournalResponse",
    "click [data-accept-value]": "selectFoodJournalResponse",
  },

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
    // Init carousel
    $('.content-window').owlCarousel({
      singleItem: true,
      rewindNav: false,
      // lazyLoad: true, // fades in images
      mouseDrag: false,
      touchDrag: false
    });
    this.changeSlideButton();
    // render widgets. Bind to this context
    this.collection.each(function(pModel, i){
      this.addWidget(pModel);
    }, this);

    this._rendered = true;
    return this;
  },
  remove: function() {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  },
  addWidget: function(pModel) {
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
    var widgetView = _(this.arrWidget).filter( function(view) { return view.model === pModel; } )[0];
    widgetView.remove();
    this.arrWidget = _(this.arrWidget).without(widgetView);
  },
  openLightbox: function(data) {
    console.log("[WidgetHolderView] openLightbox");
    // TODO: For this demo we are using just one instance,
    // therefore the model id is actually not used
    this.$el.find('.lightbox').addClass('active');

    $('.dial').knob();

    if (this.foodJournalResponses === null) {
      this.foodJournalResponses = new FoodJournalModel();
    }
  },
  closeLightbox: function() {
    console.log("[WidgetHolderView] closeLightbox");
    this.$el.find('.lightbox').removeClass('active');
  },
  nextSlide: function() {
    if ( this._rendered ) {
      $('.content-window').data('owlCarousel').next();
      this.changeSlideButton();
    }
  },
  backSlide: function() {
    if ( this._rendered ) {
      $('.content-window').data('owlCarousel').prev();
      this.changeSlideButton();
    }
  },
  changeSlideButton: function() {
    var iSlide = $('.content-window').data('owlCarousel').currentItem;
    var length = $('.content-window').data('owlCarousel').$owlItems.length;
    var $back = this.$el.find('.btn-back');
    var $next = this.$el.find('.btn-next');
    // if first item, hide back button
    if ( iSlide == 0 ) {
      $back.hide();
    } else if ( iSlide == length-1 ) {
      // if last, change text
      $next.find('.btn-text').html('Complete');
    } else {
      $back.show();
      $next.find('.btn-text').html('Next');
    }
  },
  selectFoodJournalResponse: function(e) {
    // determine the question being answered
    var $currentTarget = $(e.currentTarget);
    var answer = ($currentTarget.data('accept-value') !== undefined)? $('.dial[data-question=' + $currentTarget.data('accept-value') + ']').val() : $currentTarget.data('answer');
    this.foodJournalResponses.set($currentTarget.data('question'), answer);
    console.log(this.foodJournalResponses.attributes);
    this.nextSlide();
  }

});
