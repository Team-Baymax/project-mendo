var _ = require('underscore');

var cursorTexture = PIXI.Texture.fromImage("media/leap/cursor/cursor.png");
var fistTexture = PIXI.Texture.fromImage("media/leap/fist/fist.png");

function convertIndexToFilename(i) {
  var name = i;
  var zeroNum = 0;
  if (name < 10) {
    zeroNum ++;
  }
  if (name < 100) {
    zeroNum ++;
  }
  for (var j = 0; j < zeroNum; j++) {
    name = '0' + name;
  }
  return name;
}

module.exports = {
  preload: function(options){
    if (!this.started){
      this.EVI = options.EVI;
      _.bindAll(this, 'init', 'render');
            
      var loader = new PIXI.AssetLoader([
        'media/leap/spritesheet/rotate.json',
        'media/leap/spritesheet/select.json',
        'media/leap/spritesheet/arrow.json'
      ]);
      
      loader.onComplete = this.init;
      loader.load();
      
      this.started = true;
    }
  },
  init: function(loader, resources) {
    
    this.EVI.emit("canvasReady");
    
    this.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {transparent: true, antialias: true});
 
    $('#leap-view').append(this.renderer.view);
 
    this.stage = new PIXI.Stage();
    this.stage.interactive = true;
 
    var arrArrow = [];
    for (var i = 0; i < 60; i++)
    {
      var name = convertIndexToFilename(i);
      var t = PIXI.Texture.fromFrame('arrow_00' + name + '.png');
      arrArrow.push(t);
    }
    
    var arrRotate = [];
    for (var i = 0; i < 120; i++)
    {
      var name = convertIndexToFilename(i);
      var t = PIXI.Texture.fromFrame('rotate_00' + name + '.png');
      arrRotate.push(t);
    }
    
    var arrSelect = [];
    for (var i = 0; i < 60; i++)
    {
      var name = convertIndexToFilename(i);
      var t = PIXI.Texture.fromFrame('select_00' + name + '.png');
      arrSelect.push(t);
    }
    
    this.cursor = new PIXI.Sprite(cursorTexture);
    this.cursor.position.x = 400;
    this.cursor.position.y = 300;
    this.cursor.anchor.set(0.5, 0.5);
    this.stage.addChild(this.cursor);
    
    // Checkmark hint
    this.checkmarkHint = new PIXI.MovieClip(arrSelect);
    this.checkmarkHint.anchor.set(0.5, 0.5);
    this.stage.addChild(this.checkmarkHint);
    this.checkmarkHint.play();
    
    // Circling Hint 
    this.circleHint = new PIXI.MovieClip(arrRotate);
    this.circleHint.anchor.set(0.5, 0.5);
    this.stage.addChild(this.circleHint);
    this.circleHint.play();
    
    this.checkmarkHint.visible = false;
    this.circleHint.visible = false;
    
    // Group of arrows for fist
    this.arrowGroup = new PIXI.DisplayObjectContainer();
    this.stage.addChild(this.arrowGroup);
    // rotated positions for each arrow
    var posRoted = [
      [0, -100],
      [100, 0],
      [0, 100],
      [-100, 0]
    ];
    for (var i = 0; i < 4; i ++) {
      var arrow = new PIXI.MovieClip(arrArrow);
      arrow.anchor.set(0.5, 0.5);
      arrow.position.set( posRoted[i][0], posRoted[i][1] );
      arrow.rotation = i * 90 * Math.PI / 180;
      arrow.play();
      this.arrowGroup.addChild(arrow);
    }
    this.arrowGroup.visible = false;
    
    this.newState = this.curState = "cursor";
    this.fistState = "fistOff";
  
    requestAnimationFrame( this.render );
  },
  render: function() {
    this.renderer.render(this.stage);
    requestAnimationFrame(this.render);
  },
  switchState: function() {
    if (this.newState != this.curState) {
      console.log("state switched to " + this.newState);
      this.changeVisual();
    }
  },
  changeVisual: function() {
    // change whatever needs changing for the previous state
    switch (this.curState) {
      case "cursor":
        break;
      case "fist":
        this.arrowGroup.visible = false;
        break;
      case "circle":
        this.circleHint.visible = false;
        break;
      case "checkmark":
        this.checkmarkHint.visible = false;
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
        this.cursor.texture = fistTexture;
        switch (this.fistState) {
          case "fistNavigate":
            // Hide the bottom one
            this.arrowGroup.children[2].visible = false;
            this.arrowGroup.visible = true;
            break;
          case "fistScroll":
            // show the bottom one
            this.arrowGroup.children[2].visible = true;
            this.arrowGroup.visible = true;
            break;
          case "fistOff":
            this.arrowGroup.visible = false;
            break;
        }
        break;
      case "circle":
        this.cursor.texture = cursorTexture;
        this.circleHint.visible = true;
        break;
      case "checkmark":
        this.cursor.texture = cursorTexture;
        this.checkmarkHint.visible = true;
        break;
    }
  },
  updatePos: function(pX, pY) {
    this.cursor.position.set(pX, pY);
    this.arrowGroup.position.set(pX, pY);
    this.circleHint.position.set(pX + 100, pY);
    this.checkmarkHint.position.set(pX + 100, pY);
  },
  hide: function() {
    $('#leap-view').hide();
  },
  show: function() {
    $('#leap-view').show();
  },
}
