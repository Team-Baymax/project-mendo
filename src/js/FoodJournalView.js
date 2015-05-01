var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var week = [
  ['.calories-container .sunday','.calories-container .monday','.calories-container .tuesday','.calories-container .wednesday','.calories-container .thursday','.calories-container .friday','.calories-container .saturday'],
  [
    ['.weekly-container .carbs-container .sunday'],['.weekly-container .carbs-container .monday'],['.weekly-container .carbs-container .tueday'],['.weekly-container .carbs-container .wednesday'],['.weekly-container .carbs-container .thursday'],['.weekly-container .carbs-container .friday'],['.weekly-container .carbs-container .saturday']
  ]
];



module.exports = Backbone.View.extend({
  template: require('./FoodJournalTemplate'),
  
  initialize: function(options) {
    // this.EVI = options.EVI;

    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    
    
  //alert(week.length);
  //alert($(week[0][0][0]));
  //$(week[0][0][0]).find('.hidden').removeClass('hidden');
  for (a = 0; a < week.length; a++)
  {
    for (b = 0; b < week[0].length; b++)
    {
      //console.log(week[a][b]);
      console.log($(week[a][b]).find('.hidden'));
      //$(week[a][b]).find('.hidden').removeClass('hidden');
      var hidden = $(week[a][b]).find('.hidden');
      
      $.each(hidden, function(){
        window.setTimeout(function(){
          $(this).removeClass('hidden');
        },1000);
      });
    } 
  }
    
    
    
    
    
    
    
    return this;
  },
  remove: function() {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  },
    
});
