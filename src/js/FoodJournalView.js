var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

var graphs = [
  '.calories-container',
  '.carbs-container'
];



module.exports = Backbone.View.extend({
  template: require('./FoodJournalTemplate'),
  
  initialize: function(options) {
    // this.EVI = options.EVI;
    _.bindAll(this, 'recursiveReveal');
    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    
    // 
    var arrBar = this.$el.find('.weekly-container .calories-container .bar-container');
    for (var i = 0; i < arrBar.length; i++) {
      var arrHidden = $(arrBar[i]).find('.hidden');
      this.recursiveReveal(arrHidden, 0);
    }
    
    return this;
  },
  recursiveReveal: function(pElementArray, pI){
    $(pElementArray[pI]).removeClass('hidden');
    pI ++;
    if (pI < pElementArray.length) {
      setTimeout(function(){
        this.recursiveReveal(pElementArray, pI);
      }.bind(this), 200);
    }
    
  },
  remove: function() {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  },
    
});
