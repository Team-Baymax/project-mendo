var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    name: 'Food Journal',
    image: '../../media/foodTrackerBg.jpg',
    tags: 'Food Log, Calorie Counter, Personalize Plan',
    description: 'Personlize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.'
  }
});
