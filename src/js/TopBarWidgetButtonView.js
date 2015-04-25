var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = Backbone.View.extend({
  template: require('./TopBarWidgetButtonTemplate'),

  initialize: function(options) {
    this.EVI = options.EVI;

    return this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});
