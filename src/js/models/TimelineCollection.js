var Backbone = require('backbone');
var TimelineModuleModel = require('./TimelineModuleModel');

window.timelineData = [
  {
    time: '8:00am',
    modules: [
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Breakfast',
        subText: 'Eggs and toast',
        barTextLeft: 0,
        barTextRight: 300
      }),
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Breakfast',
        subText: 'Eggs and toast',
        barTextLeft: 0,
        barTextRight: 300
      }),
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Breakfast',
        subText: 'Eggs and toast',
        barTextLeft: 0,
        barTextRight: 300
      }),
    ]
  },
  {
    time: '8:30am',
    modules: [
      new TimelineModuleModel({
        templateStyle: 1,
        title: 'Second Breakfast',
        subText: 'Eggs and toast',
        barTextLeft: 0,
        barTextRight: 300
      })
    ]
  }
]; //end timelineData