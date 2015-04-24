var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

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
    this._rendered = true;
    return this;
  }  
});
