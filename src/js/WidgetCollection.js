var Backbone = require('backbone');
var WidgetModel = require('./WidgetModel');

module.exports = Backbone.Collection.extend({
  model: WidgetModel,
  // HACK: In an actual app, these will be stored from the server
  widgetData: {
    'food': {
      name: 'Food Journal',
      id: 'food',
      pointer: true,
      image: '../../media/foodTrackerBg.jpg',
      tags: 'Food Log, Calorie Counter, Personalize Plan',
      description: 'Personlize your diet plan and keep track of your food and caloric intake to develop better lifelong eating habits and lose weight.',
      icon: 'food_journal',
      overviewBG: 'food',
      overviewStatus: 'meeting target goals',
      leftValue: 2140,
      leftUnit: 'Calories',
      leftAvg: 'Per Day Avg',
      rightValue: 61,
      rightUnit: 'Carbs',
      rightAvg: 'Per Meal Avg',
      progress: '67%'
    },
    'blood-pressure': {
      name: 'Blood Pressure',
      id: 'blood-pressure',
      image: '../../media/bloodPressureBg.jpg',
      tags: 'Monitor and record blood pressure reading',
      description: 'Track your blood pressure to help work toward a lower blood pressure to lower the risk of heart diseases, stroke and other problems.',
      icon: 'blood_pressure',
      overviewBG: 'bloodpressure',
      overviewStatus: 'meeting target range',
      leftValue: 119,
      leftUnit: 'mmHg',
      leftAvg: 'Systolic Avg',
      rightValue: 83,
      rightUnit: 'mmHg',
      rightAvg: 'Diastolic Avg',
      progress: '83%'
    },
    'blood-glucose': {
      name: 'Blood Glucose',
      id: 'blood-glucose',
      image: '../../media/bloodSugarBg.jpg',
      tags: 'Track glucose change through the day and night',
      description: 'Monitoring your blood glucose  levels to prevent, delay or manage  at risk or diabetic diagnosis.',
      icon: 'blood_glucose',
      overviewBG: 'bloodglucose',
      overviewStatus: 'meeting target goals',
      leftValue: 110,
      leftUnit: 'mg/dL',
      leftAvg: 'Pre-meal Avg',
      rightValue: 120,
      rightUnit: 'mg/dL',
      rightAvg: 'Post-meal Avg',
      progress: '74%'
    },
    'fitness-planner': {
      name: 'Fitness Planner',
      id: 'fitness-planner',
      image: '../../media/fitnessTrackerBg.jpg',
      tags: 'Weight, Exercise, Calories Burned, Heart Rate',
      description: 'Tracking activities, setting goals, increase mindfullness of excerise, provide insight into your habits and improve your overall health.',
      icon: 'fitness_planner',
      overviewBG: 'fitness',
      overviewStatus: 'meeting fitness goals',
      leftValue: 25,
      leftUnit: 'Minutes',
      leftAvg: 'Duration Avg',
      rightValue: 316,
      rightUnit: 'Calories',
      rightAvg: 'Burned Avg',
      progress: '76%'
    },
    'sleep-analysis': {
      name: 'Sleep Analysis',
      id: 'sleep-analysis',
      image: '../../media/sleepTrackerBg.jpg',
      tags: 'Sleep Summary, Visualize Sleep Cycles',
      description: 'Monitoring your personal sleep perfomance to better understand  and work toward improving the quality of your sleep.',
      icon: 'sleep_analysis',
      overviewBG: 'sleep',
      overviewStatus: 'meeting target range',
      leftValue: "7:07",
      leftUnit: 'Hours and Minutes',
      leftAvg: 'Per Night Avg',
      progress: '89%'
    },
    'medication': {
      name: 'Medication',
      id: 'medication',
      image: '../../media/medicationTrackerBg.jpg',
      tags: 'Medication Reminder and Analysis',
      description: 'Take medicines at the right time, never forget to refill prescriptions, and understand if your prescribed medication is working for you.',
      icon: 'medication',
      overviewBG: 'medication',
      overviewStatus: 'medical adherence',
      leftValue: 3,
      leftUnit: 'Pills',
      leftAvg: 'Missed',
      rightValue: 21,
      rightUnit: 'Pills',
      rightAvg: 'Taken',
      progress: '86%'
    }
  },
  addWidget: function(pId){
    // if widget model exists via id
    if ( !this.get(pId) ) {
      // add
      this.add( this.widgetData[pId] );
    }
    return this;
  },
  removeWidget: function(pId){
    // if widget model exists via id
    if ( this.get(pId) ) {
      // remove
      this.remove( this.get(pId) );
    }
    return this;
  },
});
