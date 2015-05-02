var _ = require('underscore');
var PIXI = require('pixi.js');

var cursorTexture = PIXI.Texture.fromImage("media/leap/cursor/cursor.png");
var fistTexture = PIXI.Texture.fromImage("media/leap/fist/fist.png");

function convertIndexToFilename(i) {
  if (i < 10) {
    i = '0' + i;
  }
  if (i < 100) {
    i = '0' + i;
  }
  return i;
}

module.exports = {
  preload: function(options){
    if (!this.started){
      this.EVI = options.EVI;
      _.bindAll(this, 'init', 'render');
      PIXI.loader
        .add('arrow', 'media/leap/spritesheet/arrow.json')
        .add('rotate', 'media/leap/spritesheet/rotate.json')
        .add('select', 'media/leap/spritesheet/select.json')
        .load(this.init);
      this.started = true;
    }
  },
  init: function(loader, resources) {
    
    this.EVI.emit("canvasReady");
    
    this.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {transparent: true, antialias: true});
 
    $('#leap-view').append(this.renderer.view);
 
    this.stage = new PIXI.Container();
 
    var arrArrow = [];
    for (var i = 0; i < 60; i++)
    {
      i = convertIndexToFilename(i);
      var t = PIXI.Texture.fromFrame('arrow_00' + i + '.png');
      arrArrow.push(t);
    }
    
    var arrRotate = [];
    for (var i = 0; i < 120; i++)
    {
      i = convertIndexToFilename(i);
      var t = PIXI.Texture.fromFrame('rotate_00' + i + '.png');
      arrRotate.push(t);
    }
    
    var arrSelect = [];
    for (var i = 0; i < 60; i++)
    {
      i = convertIndexToFilename(i);
      var t = PIXI.Texture.fromFrame('select_00' + i + '.png');
      arrSelect.push(t);
    }
    
    this.cursor = new PIXI.Sprite(cursorTexture);
    // this.cursor = new PIXI.extras.MovieClip(arrArrow);
 
    this.cursor.position.x = 400;
    this.cursor.position.y = 300;
    this.cursor.anchor.set(0.5, 0.5);
    
    // this.cursor.play();
    
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
      this.changeVisual();
    }
  },
  changeVisual: function() {
    // change whatever needs changing for the previous state
    switch (this.curState) {
      case "cursor":
        break;
      case "fist":
        break;
    }
    // update state
    this.curState = this.newState;
    // change whatever needs changing for the new state
    switch (this.curState) {
      case "cursor":
      this.cursor.texture = cursorTexture;
        break;
      case "fist":
        // TODO determine which page it's on, so it know what to display
        this.cursor.texture = fistTexture;
        break;
    }
  },
  updatePos: function(pX, pY) {
    this.cursor.position.x = pX;
    this.cursor.position.y = pY;
  },
  hide: function() {
    $('#leap-view').hide();
  },
  show: function() {
    $('#leap-view').show();
  },
}
