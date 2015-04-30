var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    name: 'Robert Keller',
    age: 42,
    weight: 250,
    height: '6ft'
  }
});
