var _ = require('underscore');
var $ = require('jquery');
require('jquery.scrollto');
var PIXI = require('pixi.js');

// Utility functions for vector math
// currently just a namespace for 
// some functions that takes in 
// object presuming x and y key
var Vector2D = {
  subtract: function( v1, v2 ) {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y
    };
  },
  magnitude: function( v ) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
}
// Utility function to convert vector array to object
function arrToVec2(arr) {
  return { x: arr[0], y: arr[1] };
}

module.exports = {
  init: function() {
    // Bind context
    _.bindAll(this, 'render', 'leapUpdate');
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
    if ( ! frame.hands.length ) {
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
    
    // TODO: these parameters shouldn't be here
    this.detectPointEvents( hand, mappedPalm );
    this.detectFistEvents( hand, mappedPalm );
  },
  
  detectPointEvents: function( hand, mappedPalm ) {
    // loop through the fingers to see if only index's extended
    var indexPointing = true;
    for (var i = 0; i < hand.fingers.length; i++) {
      var finger = hand.fingers[i];
      // if index finger not extended
      if (! finger.extended && finger.type == 1) {
        indexPointing = false;
      }
      // if other fingers extended, and it's not index nor thumb
      if (finger.extended && ( finger.type != 1 && finger.type != 0 )) {
        indexPointing = false;
      }
    }
    if (! indexPointing) {
      // set firstTime to true so that when it is pointing, it'll represent it's true
      this.fingerPoint.firstTime = true;
    } else {
      var mappedFinger = this.posMap( hand.fingers[1].stabilizedTipPosition );
      // If it's the first time it's pointed,
      if (this.fingerPoint.firstTime) {
        // save index position for gesture comparison
        this.fingerPoint.fingerPos.x = mappedFinger[0];
        this.fingerPoint.fingerPos.y = mappedFinger[1];
        // save palm position for click event firing
        this.fingerPoint.palmPos.x = mappedPalm[0];
        this.fingerPoint.palmPos.y = mappedPalm[1];
        // set flag
        this.fingerPoint.firstTime = false;
        this.checkMark.reset();
      } else {
        // get the difference vector
        var delta = Vector2D.subtract(
          arrToVec2(mappedFinger),
          this.fingerPoint.fingerPos
        );
        // if going-down-complete is false,
        if (! this.checkMark.flags.downComplete) {
          // (posMap) if distance between saved index position and current position is greater than some number
          if ( 
            delta.x >= this.checkMark.dists.downX &&
            delta.y >= this.checkMark.dists.downY
          ) {
            // TODO: visual hint for progress of this motion
            console.log("Down Complete");
            this.checkMark.flags.downComplete = true;
          }
        } else {
          // if going-up-complete is false,
          if (! this.checkMark.flags.upComplete) {
            // if dist is greater than some number
            if ( 
              delta.x >= this.checkMark.dists.upX &&
              delta.y <= this.checkMark.dists.upY
            ) {
              // TODO: visual hint for progress of this motion
              console.log("Up Complete");
              this.checkMark.flags.upComplete = true;
              // **EVENT TRIGGERED
              this.fire('click', this.fingerPoint.palmPos.x, this.fingerPoint.palmPos.y);
              console.log("Click");
              this.checkMark.reset();
            }
          }
        }
      }
      // Draw cursor at the initial palm position
      this.cursor.position.x = this.fingerPoint.palmPos.x;
      this.cursor.position.y = this.fingerPoint.palmPos.y;
    }
  },
  
  detectFistEvents: function( hand, mappedPalm ) {
    // Detect fisting with grabStrength
    var fisting = false;
    if (hand.grabStrength >= this.fist.proximity) {
      fisting = true;
    }
    if (! fisting) {
      this.fist.firstTime = true;
    } else {
    /* Begin Fisting Updater */
      if (this.fist.firstTime) {
        // if it's the very first time, save palm pos
        console.log("Fisting started");
        this.fist.palmPos.x = mappedPalm[0];
        this.fist.palmPos.y = mappedPalm[1];
        this.fire('fistStart', this.fist.palmPos.x, this.fist.palmPos.y);
        this.fist.firstTime = false;
      } else {
        // get the difference vector
        var delta = Vector2D.subtract(
          arrToVec2(mappedPalm),
          this.fist.palmPos
        );
        // check for 4 directions
        // TODO: With our visual, it won't make sense to have 
        // events firing at both x and y axis at same time
        // Up
        if (delta.y < - this.fist.leeway) {
          this.fireFist('up', delta.y)
        }
        // Down
        if (delta.y > this.fist.leeway) {
          this.fireFist('down', delta.y)
        }
        // Left
        if (delta.x < - this.fist.leeway) {
          this.fireFist('left', delta.x)
        }
        // Right
        if (delta.x > this.fist.leeway) {
          this.fireFist('right', delta.x)
        }
      }
      
      
      // TODO: Draw arrows at the initial palm position
      // TODO: 
      // Since the arrows shouldn't be so easily triggered, and
      // their positions are used to represent trigger area,
      // palmPosition shouldn't be used so directly that 
      // events are triggered quickly,
      // the fist cursor needs to be drawn relatively
      // with movement scaled down
    }
    /* End Fisting Updater */
    
  },
  
  fingerPoint: {
    firstTime: true,
    fingerPos: {
      x:NaN,
      y:NaN
    },
    palmPos: {
      x:NaN,
      y:NaN
    }
  },
  
  fist: {
    firstTime: true,
    palmPos: {
      x:NaN,
      y:NaN
    },
    proximity: 0.9,
    // the distance fist can move around till triggering an event 
    leeway: 50
  },
  
  checkMark: {
    flags: {
      downComplete: false,
      upComplete: false,
    },
    dists: {
      downX: 10,
      upX: 10,
      downY: 20,
      upY: 5,
    },
    reset: function(){
      this.flags = {
        downComplete: false,
        upComplete: false,
      };
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
   * fires event onto element at some coordinate
   */
  fire: function(eventName, pX, pY, data) {
    $(document.elementFromPoint(pX, pY)).trigger(eventName, data);
  },
  /**
   * fires fist direction event
   * includes the amount it surpasses the leeway
   */
  // TODO: This event fires on the element
  // The scrolling should be handled by views separately
  // scrollTo only works on elements with overflow: scroll
  fireFist: function(pDirection, pDelta) {
    var pAmount = Math.abs(pDelta) - this.fist.leeway;
    // nerf the movement amount
    pAmount *= 0.1;
    // trigger event at the element at saved fist location with attributes
    this.fire(
      'fistMove', 
      this.fist.palmPos.x, 
      this.fist.palmPos.y, 
      { direction:pDirection, amount: pAmount }
    );
  },
}
