var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Prefixer = require('./Prefixer');

module.exports = Backbone.View.extend({
  template: require('./WidgetTemplate'),
  events: {
    "click": "emitOpenLightbox"
  },
  
  initialize: function(options) {
    this.EVI = options.EVI;
    this.$parent = Backbone.$(options.parent);
    return this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    if ( !this._rendered ) this.$parent.append(this.$el);
    var animateIn = function() {
      this.$el.addClass('active');
    }
    animateIn = _.bind( animateIn, this );
    
    setTimeout(animateIn, 20);
    
    this._rendered = true;
    return this;
  },
  remove: function() {
    var backboneRemove = function() {
      this.$el.remove();
      this.stopListening();
    }
    backboneRemove = _.bind( backboneRemove, this );
    this.$el.removeClass('active');
    setTimeout(backboneRemove, 300);
    return this;
  },
  emitOpenLightbox: function() {
    if( this.model.attributes.pointer ) {
      console.log('emitOpenLightbox');
      this.EVI.emit('openWidgetLightbox', this.model.attributes.id);
    }
  }
});
