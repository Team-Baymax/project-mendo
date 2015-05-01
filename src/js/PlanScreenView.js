var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: require('./PlanScreenTemplate'),

  initialize: function(options) {
    // this.EVI = options.EVI;

    return this.render();
  },
  render: function() {
    console.log(this.collection);

    this.collection.each(function(model, index){
      console.log(model);
    });
    this.$el.html(this.template());
    return this;
  }

});
