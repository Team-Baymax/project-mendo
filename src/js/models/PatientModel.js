var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
  defaults: {
    name: 'Robert Keller',
    age: 42,
    weight: 250,
    convertedWeight: 250,
    units: 'lbs',
    height: '6ft',
    // food journal
    weightChange: 0,
    recommendedMealPlan: ''
  },
  initialize: function () {
    _.bindAll(this, "update");
    this.on('change:units', this.update);

    this.update();
  },
  update: function () {
    this.set('convertedWeight', this.convertUnit());
    $('.current-weight-num').html(this.get('convertedWeight'));
    $('.weight-goal-num').html(this.get('goalWeight'));
    $('.unit-of-measure').html(this.get('units'));
  },
  convertUnit: function (argument) {
    // kg = lb / 2.2046
    // lb = kg * 2.2046
    return (this.get('units') == 'kgs') ? Math.round(this.get('weight') / 2.2046) : Math.round(this.get('weight'));
  }
});
