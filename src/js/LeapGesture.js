var _ = require('underscore');
var $ = require('jquery');
var PIXI = require('pixi.js');

module.exports = {
  init: function() {
    _.bindAll(this, 'render', 'leapUpdate', 'onMouseMove');
    // Insert Leap Here
    this.leapController = new Leap.Controller({
      enableGestures: true
    });
    this.leapController.use('boneHand', {
      targetEl: document.querySelector("#handModel-holder"),
      arm: true
     });
    this.leapController.use('screenPosition');

    this.leapController.on('connect', function() {
      console.log("Successfully connected.");
    }.bind(this));

    this.leapController.on('deviceStreaming', function() {
      console.log("A Leap device has been connected.");
      // If connected, make pixi and attach frame handler
      this.initPIXI();
      // The Animation Frame of Leap. steady 60fps
      this.leapController.on('frame', this.leapUpdate);
    }.bind(this));

    this.leapController.on('deviceStopped', function() {
      // TODO: Remove canvas and update loop
      console.log("A Leap device has been disconnected.");
    });

    this.leapController.connect();
  },
  onMouseMove: function(e) {
    this.cursor.position = e.data.global;
  },
  initPIXI: function(){
    this.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {transparent: true, antialias: true});
 
    $('#leap-view').append(this.renderer.view);
 
    this.stage = new PIXI.Container();
 
    var cursorTexture = PIXI.Texture.fromImage("media/RobertKeller.jpg");
    this.cursor = new PIXI.Sprite(cursorTexture);
 
    this.cursor.position.x = 400;
    this.cursor.position.y = 300;
    this.cursor.anchor = new PIXI.Point(0.5, 0.5);
    this.cursor.scale.x = 0.1;
    this.cursor.scale.y = 0.1;
  
    this.stage.interactive = true;
    this.stage.addChild(this.cursor);
 
    requestAnimationFrame( this.render );
  },
  render: function() {
    this.cursor.rotation += 0.01;

    this.renderer.render(this.stage);
    requestAnimationFrame(this.render);
  },
  leapUpdate: function(frame){
    // attach a reference of the frame to this module for ease of access
    this.frame = frame;
    // If no hand, draw nothing
    if ( !frame.hands.length ) {
      this.cursor.visible = false;
      return;
    }
    this.cursor.visible = true;
    // for the first hand there
    var hand = frame.hands[0];
    // move the cursor along
    var mappedPalm = this.posMap( hand.stabilizedPalmPosition );
    this.cursor.position.x = mappedPalm[0];
    this.cursor.position.y = mappedPalm[1];
  },

  /**
   * maps leap positions to screen position
   */
  posMap: function(pArr) {
    var normalizedPosition = this.frame.interactionBox.normalizePoint(pArr, true);
    // reverse Y
    normalizedPosition[1] = 1 - normalizedPosition[1];
    var screenDimension = [window.innerWidth, window.innerHeight];
    var mappedPosition = _.map( normalizedPosition, function(value, index){ return value * screenDimension[index] } );
    return mappedPosition;
  }
}
