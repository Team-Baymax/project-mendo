var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  moduleTemplates : [
    require('../templates/PlanScreenModuleTemplate1'),
    require('../templates/PlanScreenModuleTemplate2'),
    require('../templates/PlanScreenModuleTemplate3')
  ],
  initialize: function(options) {
    // this.EVI = options.EVI;
    this.template = this.moduleTemplates[this.model.get('templateStyle') - 1];
    return this.render();
  },
  render: function() {
    var that = this;
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

});
