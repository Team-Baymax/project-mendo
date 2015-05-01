var _ = require('underscore');
var PIXI = require('pixi.js');

var cursorTexture = PIXI.Texture.fromImage("media/leap/cursor/cursor.png");
var fistTexture = PIXI.Texture.fromImage("media/leap/fist/fist.png");

module.exports = {
  init: function(options) {
    this.EVI = options.EVI;
    _.bindAll(this, 'render');
    
    this.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {transparent: true, antialias: true});
 
    $('#leap-view').append(this.renderer.view);
 
    this.stage = new PIXI.Container();
 
    this.cursor = new PIXI.Sprite(cursorTexture);
 
    this.cursor.position.x = 400;
    this.cursor.position.y = 300;
    this.cursor.anchor = new PIXI.Point(0.5, 0.5);
    
    this.newState = this.curState = "cursor";
  
    this.stage.interactive = true;
    this.stage.addChild(this.cursor);
 
    requestAnimationFrame( this.render );
  },
  render: function() {
    this.renderer.render(this.stage);
    requestAnimationFrame(this.render);
  },
  switchState: function() {
    if (this.newState != this.curState) {
      this.curState = this.newState;
      this.changeVisual();
    }
  },
  changeVisual: function() {
    switch (this.curState) {
      case "cursor":
        this.cursor.texture = cursorTexture;
        break;
      case "fist":
        // TODO determine which page it's on, so it know what to display
        this.cursor.texture = fistTexture;
        break;
    }
  }
}
