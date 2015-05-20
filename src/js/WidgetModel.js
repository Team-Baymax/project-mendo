var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    name: 'Food Journal',
    id: 'food',
    pointer: false,
    image: '../../media/foodTrackerBg.jpg',
    tags: 'Food Log, Calorie Counter, Personalize Plan',
    description: 'Personlize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.',
    icon: 'food_journal',
    overviewBG: 'food',
    overviewStatus: 'meeting target goals',
    leftValue: 2140,
    leftUnit: 'Calories',
    leftAvg: 'Per Day Avg',
    rightValue: "",
    rightUnit: '',
    rightAvg: '',
    progress: '67%'
  }
});
