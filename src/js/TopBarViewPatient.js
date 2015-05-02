var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var TopBarWidgetButtonView = require('./TopBarWidgetButtonView');
var WidgetModel = require('./WidgetModel');
var TopBarExpandedView = require('./TopBarExpandedView');

module.exports = Backbone.View.extend({
  template: require('./TopBarTemplatePatient'),

  $main: null,

  events: {
		"click .button": "openPlanScreen",
  },

  initialize: function(options) {
    var that = this;
    this.buttons = [];

    this.listenTo(this.collection, 'add remove', this.updateWidgetButtons);

    this.EVI = options.EVI;

    this.$main = this.$el.parent().find('#main-container');

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

    this.buttons = [];
    this.$el.find('.widget-button-contain').empty();

    this.collection.each(function(buttonModel, index){
      that.buttons.push(new TopBarWidgetButtonView({
        EVI: that.EVI,
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
    if (!this.expanded){
      var that = this;

      // NOTE: is(:empty) will return false even if its just a line break
      if (! this.$el.find('.widget-button-contain').is(':empty')) {
        this.$main.append(new TopBarExpandedView({
          collection: that.collection,
          EVI: that.EVI,
          tagName: 'div',
          className: 'top-bar-expanded-container'
        }).$el);

        // FIXME: look for alternatives to settimeout
        setTimeout( function() {
          that.$main
          .find('.top-bar-expanded-container')
          .addClass('open');
          $('body').on('mousemove', function(e){
            // HACK: Only use mousemove and gain the same effect of mouseleave
            // if the top bar doesn't contain this element,
            // nor is it this element,
            // then we have a mouseleave
            if ( 
              ! $('.top-bar-expanded-container').has(e.target).length > 0 &&
              e.target !== $('.top-bar-expanded-container')[0] &&
              ! $('#top-bar').has(e.target).length > 0
            ) {
              that.closeExpandedView();
              $(this).off('mousemove');
            }
          });
        }, 20);

        setTimeout( function() {
          that.$main
          .find('.expanded-button-contain')
          .addClass('seen');
        }, 400);
      }
      
      this.expanded = true;
    }
  },
  closeExpandedView: function() {
    // FIXME: should only be removed at certain times
    Backbone.$('#main-container')
      .find('.top-bar-expanded-container')
      .removeClass('open');

    setTimeout(function(){
      Backbone.$('.top-bar-expanded-container')
      .remove()
      .off('mouseleave');
    }, 400);
    this.expanded = false;
  }
});
