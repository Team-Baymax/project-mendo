var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: require('./TopBarExpandedWidgetButtonTemplate'),
  
  events: {
    "click": "handleClick"
  },
  
  initialize: function(options) {
    this.EVI = options.EVI;

    return this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  
  handleClick: function() {
    console.log("TopBarExpandedWidgetButton Click");
    if (this.model.attributes.id == 'food') {
      this.EVI.emit('openFoodJournal');
    }
  }
});
