var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    goal: '',
    units: '',
    weightChange: 0,
    weightPerWeek: 0,
    recommendedMealPlan: ''
  }
});
