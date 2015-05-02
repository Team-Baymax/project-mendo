var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: require('./FoodJournalTemplate'),
  
  initialize: function(options) {
    // this.EVI = options.EVI;
    _.bindAll(this, 'recursiveReveal', 'handleScroll');
    
    
    return this.render();
  },
  render: function() {
    this.$el.html(this.template());
    
    this.$el.find('.scrollable').scroll( this.handleScroll );
    
    return this;
  },
  handleScroll: function(e) {
    // console.log($(e.currentTarget).scrollTop());
    if (!this.weeklyAnimated) {
      if ( $(e.currentTarget).find('.weekly-container').position().top < 200 ) {
        var arrBar = this.$el.find('.weekly-container .calories-container .bar-container');
        for (var i = 0; i < arrBar.length; i++) {
          var arrHidden = $(arrBar[i]).find('.hidden');
          this.recursiveReveal(arrHidden, 0);
        }
        this.weeklyAnimated = true;
      }
    }
    if (!this.monthlyAnimated) {
      if ( $(e.currentTarget).find('.monthly-container').position().top < 200 ) {
        var arrBar = this.$el.find('.monthly-container .calories-container .bar-container');
        for (var i = 0; i < arrBar.length; i++) {
          var arrHidden = $(arrBar[i]).find('.hidden');
          this.recursiveReveal(arrHidden, 0);
        }
        this.monthlyAnimated = true;
      }
    }
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
