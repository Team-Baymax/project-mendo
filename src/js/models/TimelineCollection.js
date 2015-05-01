var Backbone = require('backbone');
var TimelineModuleModel = require('./TimelineModuleModel');

window.timelineData = [
  {
    time: '6:30am',
    modules: [
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Sleep',
        subText: 'Duration 7hr 45min',
        firstLine: '82%',
        secondLine: 'Quality'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Log Your Weight',
        subText: 'target weight 241lbs / 109kgs',
        firstLine: '242lbs',
        secondLine: 'Last Recorded'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Blood Glucose',
        subText: 'before Breakfast',
        firstLine: 200,
        secondLine: 'mg/DL'
      }),
      new TimelineModuleModel({
        templateStyle: 3,
        title: 'Blood Pressure',
        subText: 'Heart Rate: 80bpm',
        firstLineLeft: 120,
        secondLineLeft: 'Systolic',
        firstLineRight: 97,
        secondLineRight: 'Diastolic'
      })
    ]
  },
  {
    time: '7:15am',
    modules: [
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Log Your Breakfast',
        subText: 'Target Carbs: 58-60g',
        barTextLeft: 0,
        barTextRight: 2000
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Take Your Medicine',
        subText: 'with Breakfast',
        firstLine: 'Metformin',
        secondLine: '1 tablet, 500mg'
      })
    ]
  },
  {
    time: '12:30pm',
    modules: [
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Log Your Lunch',
        subText: 'Target Carbs: 58-60g',
        barTextLeft: 0,
        barTextRight: 200
      })
    ]
  },
  {
    time: '2:30pm',
    modules: [
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Blood Glucose',
        subText: 'after Lunch',
        firstLine: 80,
        secondLine: 'mg/DL',
        status: 'too low'
      })
    ]
  },
  {
    time: '3:00pm',
    modules: [
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Snack',
        subText: 'Target Carbs: 18-20g',
        barTextLeft: 0,
        barTextRight: 200
      })
    ]
  },
  {
    time: '6:00pm',
    modules: [
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Exercise',
        subText: 'Running: 30 Minutes',
        firstLine: '300kcal',
        secondLine: 'Calories Burned',
        status: 'goal met'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Heart Rate',
        subText: 'Increased',
        firstLine: '150bpm',
        secondLine: 'Active Rate',
        status: 'healthy'
      })
    ]
  },
  {
    time: '7:00pm',
    modules: [
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Log Your Dinner',
        subText: 'Target Carbs: 58-60g',
        barTextLeft: 0,
        barTextRight: 2000
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Take Your Medicine',
        subText: 'with Dinner',
        firstLine: 'Metformin',
        secondLine: '1 tablet, 500mg'
      }),
    ]
  },
  {
    time: '12:00am',
    modules: [
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Daily Steps',
        subText: 'Goal 8,000',
        firstLine: '10,205',
        secondLine: 'steps'
      }),
    ]
  }
]; //end timelineData