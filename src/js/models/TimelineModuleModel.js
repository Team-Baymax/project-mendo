var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    title: 'Module',
    subText: '',
    barTextLeft: 0,
    barTextRight: 0,
    templateStyle: 1
  }
});
