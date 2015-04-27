var _ = require('underscore');
var $ = require('jquery');
var PIXI = require('pixi.js');

module.exports = {
  init: function() {
    // Bind context
    _.bindAll(this, 'render', 'leapUpdate', 'onMouseMove');
    // Flags
    this.isFisting = false;
    this.isFingering = false;

    this.leapController = new Leap.Controller({
      enableGestures: true
    });
    this.leapController.use('boneHand', {
      targetEl: document.querySelector("#handModel-holder"),
      arm: true,
      opacity: 0.3
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
    // FIRE THE THING
    this.fire('mousemove', mappedPalm[0], mappedPalm[1]);
    // loop through the fingers to see if only index's extended
    var indexPointing = true;
    for (var i = 0; i < hand.fingers.length; i++) {
      var finger = hand.fingers[i];
      // if index finger not extended
      if (!finger.extended && finger.type == 1) {
        indexPointing = false;
      }
      // if other fingers extended, and it's not index nor thumb
      if (finger.extended && ( finger.type != 1 && finger.type != 0 )) {
        indexPointing = false;
      }
    }
    if (indexPointing) {
      console.log("POINTING");
    }
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
  },
  /**
   * fires built-in event onto the window
   */
  fire: function(eventName, pX, pY) {
    // More optionals here?
    // var event = new MouseEvent(eventName, {
    //   'view': window,
    //   'bubbles': true,
    //   'cancelable': true,
    //   'screenX': pX,
    //   'screenY': pY
    // });
    // event.initMouseEvent
    $(document.elementFromPoint(pX, pY)).trigger(eventName);
  },
}
