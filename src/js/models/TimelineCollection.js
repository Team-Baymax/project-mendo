var Backbone = require('backbone');
var TimelineModuleModel = require('./TimelineModuleModel');

module.exports = Backbone.Collection.extend({
  model: TimelineModuleModel,
  // HACK: In an actual app, these will be populated by the user
  timelineData: {
    '8:00': [
      {
        templateStyle: 1,
        title: 'Breakfast',
        subText: 'Eggs and toast',
        barTextLeft: 0,
        barTextRight: 300
      },
    ],
    '8:30': [

    ]
  }
});
