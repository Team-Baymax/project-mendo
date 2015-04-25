var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');
var Prefixer = require('./Prefixer');

module.exports = Backbone.View.extend({
  template: require('./WidgetTemplate'),
  
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
    
    setTimeout(animateIn, 1);
    
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
  }
});
