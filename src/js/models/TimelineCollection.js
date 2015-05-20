var Backbone = require('backbone');
var TimelineModuleModel = require('./TimelineModuleModel');

window.timelineData = [
  {
    time: '12:00am',
    modules: [
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Daily Steps',
        subText: 'Goal 8,000',
        firstLine: '10,205',
        secondLine: 'steps',
        icon: 'fitness_planner',
        bgImage: 'Fitness',
        status: 'goal met'
      }),
    ]
  },
  {
    time: '9:00pm',
    modules: [
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Blood Glucose',
        subText: 'after Dinner',
        firstLine: 110,
        secondLine: 'mg/DL',
        status: 'healthy',
        icon: 'blood_glucose',
        bgImage: 'BloodGlucose',
        status: 'not logged',
        colorClass: 'negative'
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
        barTextRight: 2000,
        icon: 'food_journal',
        bgImage: 'Dinner',
        status: 'not logged',
        colorClass: 'negative'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Take Your Medicine',
        subText: 'with Dinner',
        firstLine: 'Metformin',
        secondLine: '1 tablet, 500mg',
        icon: 'medication',
        bgImage: 'Medication',
        status: 'not taken',
        colorClass: 'negative'
      }),
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
        icon: 'fitness_planner',
        bgImage: 'Fitness',
        status: 'goal met'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Heart Rate',
        subText: 'Increased',
        firstLine: '150bpm',
        secondLine: 'Active Rate',
        icon: 'fitness_planner',
        bgImage: 'HeartRate',
        status: 'healthy'
      })
    ]
  },
  {
    time: '3:00pm',
    modules: [
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Log Your Snack',
        subText: 'Target Carbs: 18-20g',
        barTextLeft: 0,
        barTextRight: 200,
        icon: 'food_journal',
        bgImage: 'Snack',
        status: 'not logged',
        colorClass: 'negative'
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
        status: 'too low',
        icon: 'blood_glucose',
        bgImage: 'BloodGlucose',
        status: 'too low',
        colorClass: 'negative'
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
        barTextRight: 200,
        icon: 'food_journal',
        bgImage: 'Lunch',
        status: 'logged'
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
        barTextRight: 2000,
        icon: 'food_journal',
        bgImage: 'Breakfast',
        status: 'logged'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Take Your Medicine',
        subText: 'with Breakfast',
        firstLine: 'Metformin',
        secondLine: '1 tablet, 500mg',
        icon: 'medication',
        bgImage: 'Medication',
        status: 'taken'
      })
    ]
  },
  {
    time: '6:30am',
    modules: [
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Sleep',
        subText: 'Duration 7hr 45min',
        firstLine: '82%',
        secondLine: 'Quality',
        icon: 'sleep_analysis',
        bgImage: 'Sleep',
        status: 'goal met'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Log Your Weight',
        subText: 'target weight 241lbs / 109kgs',
        firstLine: '250lbs',
        secondLine: 'Last Recorded',
        icon: 'fitness_planner',
        bgImage: 'Weight',
        status: 'lost 1lb'
      }),
      new TimelineModuleModel({
        templateStyle: 2,
        title: 'Blood Glucose',
        subText: 'before Breakfast',
        firstLine: 200,
        secondLine: 'mg/DL',
        icon: 'blood_glucose',
        bgImage: 'BloodGlucose',
        status: 'too high',
        colorClass: 'negative'
      }),
      new TimelineModuleModel({
        templateStyle: 3,
        title: 'Blood Pressure',
        subText: 'Heart Rate: 80bpm',
        firstLineLeft: 120,
        secondLineLeft: 'Systolic',
        firstLineRight: 97,
        secondLineRight: 'Diastolic',
        icon: 'blood_pressure',
        bgImage: 'BloodPressure',
        status: 'prehypertension',
        colorClass: 'negative'
      })
    ]
  },
]; //end timelineData
