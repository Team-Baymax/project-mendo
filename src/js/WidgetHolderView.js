// HACK: owlslider attaches itself to the global jquery object,
// forcing us to have a global one outside the context of browserify.
// Have to use the global $ to get that element
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var WidgetModel = require('./WidgetModel');
var WidgetView = require('./WidgetView');
var WidgetTemplate = require('./WidgetTemplate');

require('./jquery-knob');

module.exports = Backbone.View.extend({

  foodJournalResponses: null,

  template: require('./WidgetHolderTemplate'),

  events: {
    "click .lightbox-bg": "closeLightbox",
    "click .btn-next": "nextSlide",
    "click .btn-back": "backSlide",
    "click [data-answer]": "selectFoodJournalResponse",
    "click [data-accept-value]": "selectFoodJournalResponse",
    "fistStart": "setFisting",
    "fistMove": "fistNavigate",
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
    this.$el.html(this.template(window.Patient.attributes));
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
    if (!this.welcomeTextRemoved) {
      this.$el.find('.beginning-text').remove();
      this.welcomeTextRemoved = true;
    }
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
    var that = this;
    console.log("[WidgetHolderView] openLightbox");
    // TODO: For this demo we are using just one instance,
    // therefore the model id is actually not used
    this.$el.find('.lightbox').addClass('active');

    var $dial = $('#weightChangeSlider');
    $dial.knobObject = $dial.knob({
      change : function (value) {
        window.Patient.set('weightChange', Math.round(value));
        that.$el.find('.weight-goal-num').html( Math.round(window.Patient.get('convertedWeight') - window.Patient.get('weightChange') ) );
      }
    });
    $dial.parent().on('leapCircle', function(e, data){
      var dV = data.amount * (data.clockwise ? 1 : -1);
      this.knobObject.val(parseInt( this.knobObject.v + dV, 10 ));
    }.bind($dial));
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
    return;
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
    $('[data-question=' + $currentTarget.data('question') + ']').removeClass('active');
    $currentTarget.addClass('active');
    var answer = ($currentTarget.data('accept-value') !== undefined)? $('.dial[data-question=' + $currentTarget.data('accept-value') + ']').val() : $currentTarget.data('answer');

    //update the model
    window.Patient.set($currentTarget.data('question'), answer);
    this.updateQuestions($currentTarget.data('question'), answer);
    this.nextSlide();
  },
  updateQuestions: function (question, answer) {
    switch (question) {
      case 'units':
      $('.dial').trigger('configure', {
          'max': Math.floor( window.Patient.get('convertedWeight') / 5)
      });
      $('.dial').trigger('change');
      break;
    }
  },
  // let slide listen to fist
  setFisting: function(e) {
    this.slideListenToFist = true;
  },
  fistNavigate: function(e, data) {
    var lightboxIsOpen = this.$el.find('.lightbox').hasClass('active');
    // force these gestures to only run once every fisting
    if (this.slideListenToFist && lightboxIsOpen) {
      if (data.direction == 'up' && data.amount > 10) {
        this.closeLightbox();
      }
      if (data.direction == 'left'){
        this.backSlide();
        this.slideListenToFist = false;
      }
      if (data.direction == 'right'){
        this.nextSlide();
        this.slideListenToFist = false;
      }
    }
  }
});
