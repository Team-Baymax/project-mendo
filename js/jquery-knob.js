(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!jQuery Knob*/
/**
 * Downward compatible, touchable dial
 *
 * Version: 1.2.0 (15/07/2012)
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2012 Anthony Terrien
 * Under MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to vor, eskimoblood, spiffistan, FabrizioC
 */
(function($) {

    /**
     * Kontrol library
     */
    "use strict";

    /**
     * Definition of globals and core
     */
    var k = {}, // kontrol
        max = Math.max,
        min = Math.min;

    k.c = {};
    k.c.d = $(document);
    k.c.t = function (e) {
        return e.originalEvent.touches.length - 1;
    };

    /**
     * Kontrol Object
     *
     * Definition of an abstract UI control
     *
     * Each concrete component must call this one.
     * <code>
     * k.o.call(this);
     * </code>
     */
    k.o = function () {
        var s = this;

        this.o = null; // array of options
        this.$ = null; // jQuery wrapped element
        this.i = null; // mixed HTMLInputElement or array of HTMLInputElement
        this.g = null; // 2D graphics context for 'pre-rendering'
        this.v = null; // value ; mixed array or integer
        this.cv = null; // change value ; not commited value
        this.x = 0; // canvas x position
        this.y = 0; // canvas y position
        this.$c = null; // jQuery canvas element
        this.c = null; // rendered canvas context
        this.t = 0; // touches index
        this.isInit = false;
        this.fgColor = null; // main color
        this.pColor = null; // previous color
        this.dH = null; // draw hook
        this.cH = null; // change hook
        this.eH = null; // cancel hook
        this.rH = null; // release hook

        this.run = function () {
            var cf = function (e, conf) {
                var k;
                for (k in conf) {
                    s.o[k] = conf[k];
                }
                s.init();
                s._configure()
                 ._draw();
            };

            if(this.$.data('kontroled')) return;
            this.$.data('kontroled', true);

            this.extend();
            this.o = $.extend(
                {
                    // Config
                    min : this.$.data('min') || 0,
                    max : this.$.data('max') || 100,
                    stopper : true,
                    readOnly : this.$.data('readonly'),

                    // UI
                    cursor : (this.$.data('cursor') === true && 30)
                                || this.$.data('cursor')
                                || 0,
                    thickness : this.$.data('thickness') || 0.35,
                    lineCap : this.$.data('linecap') || 'butt',
                    width : this.$.data('width') || 200,
                    height : this.$.data('height') || 200,
                    displayInput : this.$.data('displayinput') == null || this.$.data('displayinput'),
                    displayPrevious : this.$.data('displayprevious'),
                    fgColor : this.$.data('fgcolor') || '#87CEEB',
                    inputColor: this.$.data('inputcolor') || this.$.data('fgcolor') || '#87CEEB',
                    inline : false,
                    step : this.$.data('step') || 1,

                    // Hooks
                    draw : null, // function () {}
                    change : null, // function (value) {}
                    cancel : null, // function () {}
                    release : null // function (value) {}
                }, this.o
            );

            // routing value
            if(this.$.is('fieldset')) {

                // fieldset = array of integer
                this.v = {};
                this.i = this.$.find('input')
                this.i.each(function(k) {
                    var $this = $(this);
                    s.i[k] = $this;
                    s.v[k] = $this.val();

                    $this.bind(
                        'change'
                        , function () {
                            var val = {};
                            val[k] = $this.val();
                            s.val(val);
                        }
                    );
                });
                this.$.find('legend').remove();

            } else {
                // input = integer
                this.i = this.$;
                this.v = this.$.val();
                (this.v == '') && (this.v = this.o.min);

                this.$.bind(
                    'change'
                    , function () {
                        s.val(s._validate(s.$.val()));
                    }
                );
            }

            (!this.o.displayInput) && this.$.hide();

            this.$c = $('<canvas width="' +
                            this.o.width + 'px" height="' +
                            this.o.height + 'px"></canvas>');
            this.c = this.$c[0].getContext("2d");

            this.$
                .wrap($('<div style="' + (this.o.inline ? 'display:inline;' : '') +
                        'width:' + this.o.width + 'px;height:' +
                        this.o.height + 'px;"></div>'))
                .before(this.$c);

            if (this.v instanceof Object) {
                this.cv = {};
                this.copy(this.v, this.cv);
            } else {
                this.cv = this.v;
            }

            this.$
                .bind("configure", cf)
                .parent()
                .bind("configure", cf);

            this._listen()
                ._configure()
                ._xy()
                .init();

            this.isInit = true;

            this._draw();

            return this;
        };

        this._draw = function () {

            // canvas pre-rendering
            var d = true,
                c = document.createElement('canvas');

            // c.setAttribute("class", "knobCanvas");
            c.width = s.o.width;
            c.height = s.o.height;
            s.g = c.getContext('2d');

            s.clear();

            s.dH
            && (d = s.dH());

            (d !== false) && s.draw();

            s.c.drawImage(c, 0, 0);
            c = null;
        };

        this._touch = function (e) {

            var touchMove = function (e) {

                var v = s.xy2val(
                            e.originalEvent.touches[s.t].pageX,
                            e.originalEvent.touches[s.t].pageY
                            );

                if (v == s.cv) return;

                if (
                    s.cH
                    && (s.cH(v) === false)
                ) return;


                s.change(s._validate(v));
                s._draw();
            };

            // get touches index
            this.t = k.c.t(e);

            // First touch
            touchMove(e);

            // Touch events listeners
            k.c.d
                .bind("touchmove.k", touchMove)
                .bind(
                    "touchend.k"
                    , function () {
                        k.c.d.unbind('touchmove.k touchend.k');

                        if (
                            s.rH
                            && (s.rH(s.cv) === false)
                        ) return;

                        s.val(s.cv);
                    }
                );

            return this;
        };

        this._mouse = function (e) {

            var mouseMove = function (e) {
                var v = s.xy2val(e.pageX, e.pageY);
                if (v == s.cv) return;

                if (
                    s.cH
                    && (s.cH(v) === false)
                ) return;

                s.change(s._validate(v));
                s._draw();
            };

            // First click
            mouseMove(e);

            // Mouse events listeners
            k.c.d
                .bind("mousemove.k", mouseMove)
                .bind(
                    // Escape key cancel current change
                    "keyup.k"
                    , function (e) {
                        if (e.keyCode === 27) {
                            k.c.d.unbind("mouseup.k mousemove.k keyup.k");

                            if (
                                s.eH
                                && (s.eH() === false)
                            ) return;

                            s.cancel();
                        }
                    }
                )
                .bind(
                    "mouseup.k"
                    , function (e) {
                        k.c.d.unbind('mousemove.k mouseup.k keyup.k');

                        if (
                            s.rH
                            && (s.rH(s.cv) === false)
                        ) return;

                        s.val(s.cv);
                    }
                );

            return this;
        };

        this._xy = function () {
            var o = this.$c.offset();
            this.x = o.left;
            this.y = o.top;
            return this;
        };

        this._listen = function () {

            if (!this.o.readOnly) {
                this.$c
                    .bind(
                        "mousedown"
                        , function (e) {
                            e.preventDefault();
                            s._xy()._mouse(e);
                         }
                    )
                    .bind(
                        "touchstart"
                        , function (e) {
                            e.preventDefault();
                            s._xy()._touch(e);
                         }
                    );
                this.listen();
            } else {
                this.$.attr('readonly', 'readonly');
            }

            return this;
        };

        this._configure = function () {

            // Hooks
            if (this.o.draw) this.dH = this.o.draw;
            if (this.o.change) this.cH = this.o.change;
            if (this.o.cancel) this.eH = this.o.cancel;
            if (this.o.release) this.rH = this.o.release;

            if (this.o.displayPrevious) {
                this.pColor = this.h2rgba(this.o.fgColor, "0.4");
                this.fgColor = this.h2rgba(this.o.fgColor, "0.6");
            } else {
                this.fgColor = this.o.fgColor;
            }

            return this;
        };

        this._clear = function () {
            this.$c[0].width = this.$c[0].width;
        };

        this._validate = function(v) {
            return (~~ (((v < 0) ? -0.5 : 0.5) + (v/this.o.step))) * this.o.step;
        };

        // Abstract methods
        this.listen = function () {}; // on start, one time
        this.extend = function () {}; // each time configure triggered
        this.init = function () {}; // each time configure triggered
        this.change = function (v) {}; // on change
        this.val = function (v) {}; // on release
        this.xy2val = function (x, y) {}; //
        this.draw = function () {}; // on change / on release
        this.clear = function () { this._clear(); };

        // Utils
        this.h2rgba = function (h, a) {
            var rgb;
            h = h.substring(1,7)
            rgb = [parseInt(h.substring(0,2),16)
                   ,parseInt(h.substring(2,4),16)
                   ,parseInt(h.substring(4,6),16)];
            return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
        };

        this.copy = function (f, t) {
            for (var i in f) { t[i] = f[i]; }
        };
    };


    /**
     * k.Dial
     */
    k.Dial = function () {
        k.o.call(this);

        this.startAngle = null;
        this.xy = null;
        this.radius = null;
        this.lineWidth = null;
        this.cursorExt = null;
        this.w2 = null;
        this.PI2 = 2*Math.PI;

        this.extend = function () {
            this.o = $.extend(
                {
                    bgColor : this.$.data('bgcolor') || '#EEEEEE',
                    angleOffset : this.$.data('angleoffset') || 0,
                    angleArc : this.$.data('anglearc') || 360,
                    inline : true
                }, this.o
            );
        };

        this.val = function (v) {
            if (null != v) {
                this.cv = this.o.stopper ? max(min(v, this.o.max), this.o.min) : v;
                this.v = this.cv;
                this.$.val(this.v);
                this._draw();
            } else {
                return this.v;
            }
        };

        this.xy2val = function (x, y) {
            var a, ret;

            a = Math.atan2(
                        x - (this.x + this.w2)
                        , - (y - this.y - this.w2)
                    ) - this.angleOffset;

            if(this.angleArc != this.PI2 && (a < 0) && (a > -0.5)) {
                // if isset angleArc option, set to min if .5 under min
                a = 0;
            } else if (a < 0) {
                a += this.PI2;
            }

            ret = ~~ (0.5 + (a * (this.o.max - this.o.min) / this.angleArc))
                    + this.o.min;

            this.o.stopper
            && (ret = max(min(ret, this.o.max), this.o.min));

            return ret;
        };

        this.listen = function () {
            // bind MouseWheel
            var s = this,
                mw = function (e) {
                            e.preventDefault();
                            var ori = e.originalEvent
                                ,deltaX = ori.detail || ori.wheelDeltaX
                                ,deltaY = ori.detail || ori.wheelDeltaY
                                ,v = parseInt(s.$.val()) + (deltaX>0 || deltaY>0 ? s.o.step : deltaX<0 || deltaY<0 ? -s.o.step : 0);

                            if (
                                s.cH
                                && (s.cH(v) === false)
                            ) return;
                            s.val(v);
                        }
                , kval, to, m = 1, kv = {37:-s.o.step, 38:s.o.step, 39:s.o.step, 40:-s.o.step};

            this.$
                .bind(
                    "keydown"
                    ,function (e) {
                        var kc = e.keyCode;

                        // numpad support
                        if(kc >= 96 && kc <= 105) {
                            kc = e.keyCode = kc - 48;
                        }

                        kval = parseInt(String.fromCharCode(kc));

                        if (isNaN(kval)) {

                            (kc !== 13)         // enter
                            && (kc !== 8)       // bs
                            && (kc !== 9)       // tab
                            && (kc !== 189)     // -
                            && e.preventDefault();

                            // arrows
                            if ($.inArray(kc,[37,38,39,40]) > -1) {
                                e.preventDefault();

                                var v = parseInt(s.$.val()) + kv[kc] * m;

                                s.o.stopper
                                && (v = max(min(v, s.o.max), s.o.min));

                                s.change(v);
                                s._draw();

                                // long time keydown speed-up
                                to = window.setTimeout(
                                    function () { m*=2; }
                                    ,30
                                );
                            }
                        }
                    }
                )
                .bind(
                    "keyup"
                    ,function (e) {
                        if (isNaN(kval)) {
                            if (to) {
                                window.clearTimeout(to);
                                to = null;
                                m = 1;
                                s.val(s.$.val());
                            }
                        } else {
                            // kval postcond
                            (s.$.val() > s.o.max && s.$.val(s.o.max))
                            || (s.$.val() < s.o.min && s.$.val(s.o.min));
                        }

                    }
                );
            this.$c.bind("mousewheel DOMMouseScroll", mw);
            this.$.bind("mousewheel DOMMouseScroll", mw)
        };

        this.init = function () {

            if (
                this.v < this.o.min
                || this.v > this.o.max
            ) this.v = this.o.min;

            this.$.val(this.v);
            this.w2 = this.o.width / 2;
            this.cursorExt = this.o.cursor / 100;
            this.xy = this.w2;
            this.lineWidth = this.xy * this.o.thickness;
            this.lineCap = this.o.lineCap;
            this.radius = this.xy - this.lineWidth / 2;

            this.o.angleOffset
            && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset);

            this.o.angleArc
            && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc);

            // deg to rad
            this.angleOffset = this.o.angleOffset * Math.PI / 180;
            this.angleArc = this.o.angleArc * Math.PI / 180;

            // compute start and end angles
            this.startAngle = 1.5 * Math.PI + this.angleOffset;
            this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;

            var s = max(
                            String(Math.abs(this.o.max)).length
                            , String(Math.abs(this.o.min)).length
                            , 2
                            ) + 2;

            this.o.displayInput
                && this.i.css({
                        'width' : ((this.o.width / 2 + 4) >> 0) + 'px'
                        ,'height' : ((this.o.width / 3) >> 0) + 'px'
                        ,'position' : 'absolute'
                        ,'vertical-align' : 'middle'
                        ,'margin-top' : ((this.o.width / 3) >> 0) + 'px'
                        ,'margin-left' : '-' + ((this.o.width * 3 / 4 + 2) >> 0) + 'px'
                        ,'border' : 0
                        ,'background' : 'none'
                        ,'font' : 'bold ' + ((this.o.width / s) >> 0) + 'px Arial'
                        ,'text-align' : 'center'
                        ,'color' : this.o.inputColor || this.o.fgColor
                        ,'padding' : '0px'
                        ,'-webkit-appearance': 'none'
                        })
                || this.i.css({
                        'width' : '0px'
                        ,'visibility' : 'hidden'
                        });
        };

        this.change = function (v) {
            this.cv = v;
            this.$.val(v);
        };

        this.angle = function (v) {
            return (v - this.o.min) * this.angleArc / (this.o.max - this.o.min);
        };

        this.draw = function () {

            var c = this.g,                 // context
                a = this.angle(this.cv)    // Angle
                , sat = this.startAngle     // Start angle
                , eat = sat + a             // End angle
                , sa, ea                    // Previous angles
                , r = 1;

            c.lineWidth = this.lineWidth;

            c.lineCap = this.lineCap;

            this.o.cursor
                && (sat = eat - this.cursorExt)
                && (eat = eat + this.cursorExt);

            c.beginPath();
                c.strokeStyle = this.o.bgColor;
                c.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, true);
            c.stroke();

            if (this.o.displayPrevious) {
                ea = this.startAngle + this.angle(this.v);
                sa = this.startAngle;
                this.o.cursor
                    && (sa = ea - this.cursorExt)
                    && (ea = ea + this.cursorExt);

                c.beginPath();
                    c.strokeStyle = this.pColor;
                    c.arc(this.xy, this.xy, this.radius, sa, ea, false);
                c.stroke();
                r = (this.cv == this.v);
            }

            c.beginPath();
                c.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                c.arc(this.xy, this.xy, this.radius, sat, eat, false);
            c.stroke();
        };

        this.cancel = function () {
            this.val(this.v);
        };
    };

    $.fn.dial = $.fn.knob = function (o) {
        var d = new k.Dial();
        d.o = o;
        d.$ = $(this);
        d.run();
        console.log(d);
        return d;
    };

})(jQuery);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvanF1ZXJ5LWtub2IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIWpRdWVyeSBLbm9iKi9cbi8qKlxuICogRG93bndhcmQgY29tcGF0aWJsZSwgdG91Y2hhYmxlIGRpYWxcbiAqXG4gKiBWZXJzaW9uOiAxLjIuMCAoMTUvMDcvMjAxMilcbiAqIFJlcXVpcmVzOiBqUXVlcnkgdjEuNytcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTIgQW50aG9ueSBUZXJyaWVuXG4gKiBVbmRlciBNSVQgYW5kIEdQTCBsaWNlbnNlczpcbiAqICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICogIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwuaHRtbFxuICpcbiAqIFRoYW5rcyB0byB2b3IsIGVza2ltb2Jsb29kLCBzcGlmZmlzdGFuLCBGYWJyaXppb0NcbiAqL1xuKGZ1bmN0aW9uKCQpIHtcblxuICAgIC8qKlxuICAgICAqIEtvbnRyb2wgbGlicmFyeVxuICAgICAqL1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5pdGlvbiBvZiBnbG9iYWxzIGFuZCBjb3JlXG4gICAgICovXG4gICAgdmFyIGsgPSB7fSwgLy8ga29udHJvbFxuICAgICAgICBtYXggPSBNYXRoLm1heCxcbiAgICAgICAgbWluID0gTWF0aC5taW47XG5cbiAgICBrLmMgPSB7fTtcbiAgICBrLmMuZCA9ICQoZG9jdW1lbnQpO1xuICAgIGsuYy50ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGUub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aCAtIDE7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEtvbnRyb2wgT2JqZWN0XG4gICAgICpcbiAgICAgKiBEZWZpbml0aW9uIG9mIGFuIGFic3RyYWN0IFVJIGNvbnRyb2xcbiAgICAgKlxuICAgICAqIEVhY2ggY29uY3JldGUgY29tcG9uZW50IG11c3QgY2FsbCB0aGlzIG9uZS5cbiAgICAgKiA8Y29kZT5cbiAgICAgKiBrLm8uY2FsbCh0aGlzKTtcbiAgICAgKiA8L2NvZGU+XG4gICAgICovXG4gICAgay5vID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5vID0gbnVsbDsgLy8gYXJyYXkgb2Ygb3B0aW9uc1xuICAgICAgICB0aGlzLiQgPSBudWxsOyAvLyBqUXVlcnkgd3JhcHBlZCBlbGVtZW50XG4gICAgICAgIHRoaXMuaSA9IG51bGw7IC8vIG1peGVkIEhUTUxJbnB1dEVsZW1lbnQgb3IgYXJyYXkgb2YgSFRNTElucHV0RWxlbWVudFxuICAgICAgICB0aGlzLmcgPSBudWxsOyAvLyAyRCBncmFwaGljcyBjb250ZXh0IGZvciAncHJlLXJlbmRlcmluZydcbiAgICAgICAgdGhpcy52ID0gbnVsbDsgLy8gdmFsdWUgOyBtaXhlZCBhcnJheSBvciBpbnRlZ2VyXG4gICAgICAgIHRoaXMuY3YgPSBudWxsOyAvLyBjaGFuZ2UgdmFsdWUgOyBub3QgY29tbWl0ZWQgdmFsdWVcbiAgICAgICAgdGhpcy54ID0gMDsgLy8gY2FudmFzIHggcG9zaXRpb25cbiAgICAgICAgdGhpcy55ID0gMDsgLy8gY2FudmFzIHkgcG9zaXRpb25cbiAgICAgICAgdGhpcy4kYyA9IG51bGw7IC8vIGpRdWVyeSBjYW52YXMgZWxlbWVudFxuICAgICAgICB0aGlzLmMgPSBudWxsOyAvLyByZW5kZXJlZCBjYW52YXMgY29udGV4dFxuICAgICAgICB0aGlzLnQgPSAwOyAvLyB0b3VjaGVzIGluZGV4XG4gICAgICAgIHRoaXMuaXNJbml0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmdDb2xvciA9IG51bGw7IC8vIG1haW4gY29sb3JcbiAgICAgICAgdGhpcy5wQ29sb3IgPSBudWxsOyAvLyBwcmV2aW91cyBjb2xvclxuICAgICAgICB0aGlzLmRIID0gbnVsbDsgLy8gZHJhdyBob29rXG4gICAgICAgIHRoaXMuY0ggPSBudWxsOyAvLyBjaGFuZ2UgaG9va1xuICAgICAgICB0aGlzLmVIID0gbnVsbDsgLy8gY2FuY2VsIGhvb2tcbiAgICAgICAgdGhpcy5ySCA9IG51bGw7IC8vIHJlbGVhc2UgaG9va1xuXG4gICAgICAgIHRoaXMucnVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNmID0gZnVuY3Rpb24gKGUsIGNvbmYpIHtcbiAgICAgICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gY29uZikge1xuICAgICAgICAgICAgICAgICAgICBzLm9ba10gPSBjb25mW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzLmluaXQoKTtcbiAgICAgICAgICAgICAgICBzLl9jb25maWd1cmUoKVxuICAgICAgICAgICAgICAgICAuX2RyYXcoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKHRoaXMuJC5kYXRhKCdrb250cm9sZWQnKSkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy4kLmRhdGEoJ2tvbnRyb2xlZCcsIHRydWUpO1xuXG4gICAgICAgICAgICB0aGlzLmV4dGVuZCgpO1xuICAgICAgICAgICAgdGhpcy5vID0gJC5leHRlbmQoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBDb25maWdcbiAgICAgICAgICAgICAgICAgICAgbWluIDogdGhpcy4kLmRhdGEoJ21pbicpIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgIG1heCA6IHRoaXMuJC5kYXRhKCdtYXgnKSB8fCAxMDAsXG4gICAgICAgICAgICAgICAgICAgIHN0b3BwZXIgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICByZWFkT25seSA6IHRoaXMuJC5kYXRhKCdyZWFkb25seScpLFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVJXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvciA6ICh0aGlzLiQuZGF0YSgnY3Vyc29yJykgPT09IHRydWUgJiYgMzApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuJC5kYXRhKCdjdXJzb3InKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAwLFxuICAgICAgICAgICAgICAgICAgICB0aGlja25lc3MgOiB0aGlzLiQuZGF0YSgndGhpY2tuZXNzJykgfHwgMC4zNSxcbiAgICAgICAgICAgICAgICAgICAgbGluZUNhcCA6IHRoaXMuJC5kYXRhKCdsaW5lY2FwJykgfHwgJ2J1dHQnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aCA6IHRoaXMuJC5kYXRhKCd3aWR0aCcpIHx8IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IDogdGhpcy4kLmRhdGEoJ2hlaWdodCcpIHx8IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUlucHV0IDogdGhpcy4kLmRhdGEoJ2Rpc3BsYXlpbnB1dCcpID09IG51bGwgfHwgdGhpcy4kLmRhdGEoJ2Rpc3BsYXlpbnB1dCcpLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5UHJldmlvdXMgOiB0aGlzLiQuZGF0YSgnZGlzcGxheXByZXZpb3VzJyksXG4gICAgICAgICAgICAgICAgICAgIGZnQ29sb3IgOiB0aGlzLiQuZGF0YSgnZmdjb2xvcicpIHx8ICcjODdDRUVCJyxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRDb2xvcjogdGhpcy4kLmRhdGEoJ2lucHV0Y29sb3InKSB8fCB0aGlzLiQuZGF0YSgnZmdjb2xvcicpIHx8ICcjODdDRUVCJyxcbiAgICAgICAgICAgICAgICAgICAgaW5saW5lIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXAgOiB0aGlzLiQuZGF0YSgnc3RlcCcpIHx8IDEsXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSG9va3NcbiAgICAgICAgICAgICAgICAgICAgZHJhdyA6IG51bGwsIC8vIGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZSA6IG51bGwsIC8vIGZ1bmN0aW9uICh2YWx1ZSkge31cbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsIDogbnVsbCwgLy8gZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgICAgICAgICAgcmVsZWFzZSA6IG51bGwgLy8gZnVuY3Rpb24gKHZhbHVlKSB7fVxuICAgICAgICAgICAgICAgIH0sIHRoaXMub1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gcm91dGluZyB2YWx1ZVxuICAgICAgICAgICAgaWYodGhpcy4kLmlzKCdmaWVsZHNldCcpKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBmaWVsZHNldCA9IGFycmF5IG9mIGludGVnZXJcbiAgICAgICAgICAgICAgICB0aGlzLnYgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLmkgPSB0aGlzLiQuZmluZCgnaW5wdXQnKVxuICAgICAgICAgICAgICAgIHRoaXMuaS5lYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcy5pW2tdID0gJHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHMudltrXSA9ICR0aGlzLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmJpbmQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2hhbmdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbFtrXSA9ICR0aGlzLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMudmFsKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy4kLmZpbmQoJ2xlZ2VuZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGlucHV0ID0gaW50ZWdlclxuICAgICAgICAgICAgICAgIHRoaXMuaSA9IHRoaXMuJDtcbiAgICAgICAgICAgICAgICB0aGlzLnYgPSB0aGlzLiQudmFsKCk7XG4gICAgICAgICAgICAgICAgKHRoaXMudiA9PSAnJykgJiYgKHRoaXMudiA9IHRoaXMuby5taW4pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kLmJpbmQoXG4gICAgICAgICAgICAgICAgICAgICdjaGFuZ2UnXG4gICAgICAgICAgICAgICAgICAgICwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcy52YWwocy5fdmFsaWRhdGUocy4kLnZhbCgpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAoIXRoaXMuby5kaXNwbGF5SW5wdXQpICYmIHRoaXMuJC5oaWRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuJGMgPSAkKCc8Y2FudmFzIHdpZHRoPVwiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vLndpZHRoICsgJ3B4XCIgaGVpZ2h0PVwiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vLmhlaWdodCArICdweFwiPjwvY2FudmFzPicpO1xuICAgICAgICAgICAgdGhpcy5jID0gdGhpcy4kY1swXS5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgICAgICAgIHRoaXMuJFxuICAgICAgICAgICAgICAgIC53cmFwKCQoJzxkaXYgc3R5bGU9XCInICsgKHRoaXMuby5pbmxpbmUgPyAnZGlzcGxheTppbmxpbmU7JyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGg6JyArIHRoaXMuby53aWR0aCArICdweDtoZWlnaHQ6JyArXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm8uaGVpZ2h0ICsgJ3B4O1wiPjwvZGl2PicpKVxuICAgICAgICAgICAgICAgIC5iZWZvcmUodGhpcy4kYyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnYgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN2ID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5jb3B5KHRoaXMudiwgdGhpcy5jdik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3YgPSB0aGlzLnY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJFxuICAgICAgICAgICAgICAgIC5iaW5kKFwiY29uZmlndXJlXCIsIGNmKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxuICAgICAgICAgICAgICAgIC5iaW5kKFwiY29uZmlndXJlXCIsIGNmKTtcblxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuKClcbiAgICAgICAgICAgICAgICAuX2NvbmZpZ3VyZSgpXG4gICAgICAgICAgICAgICAgLl94eSgpXG4gICAgICAgICAgICAgICAgLmluaXQoKTtcblxuICAgICAgICAgICAgdGhpcy5pc0luaXQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLl9kcmF3KCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2RyYXcgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIGNhbnZhcyBwcmUtcmVuZGVyaW5nXG4gICAgICAgICAgICB2YXIgZCA9IHRydWUsXG4gICAgICAgICAgICAgICAgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gICAgICAgICAgICAvLyBjLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwia25vYkNhbnZhc1wiKTtcbiAgICAgICAgICAgIGMud2lkdGggPSBzLm8ud2lkdGg7XG4gICAgICAgICAgICBjLmhlaWdodCA9IHMuby5oZWlnaHQ7XG4gICAgICAgICAgICBzLmcgPSBjLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICAgIHMuY2xlYXIoKTtcblxuICAgICAgICAgICAgcy5kSFxuICAgICAgICAgICAgJiYgKGQgPSBzLmRIKCkpO1xuXG4gICAgICAgICAgICAoZCAhPT0gZmFsc2UpICYmIHMuZHJhdygpO1xuXG4gICAgICAgICAgICBzLmMuZHJhd0ltYWdlKGMsIDAsIDApO1xuICAgICAgICAgICAgYyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fdG91Y2ggPSBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICB2YXIgdG91Y2hNb3ZlID0gZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAgICAgICAgIHZhciB2ID0gcy54eTJ2YWwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbcy50XS5wYWdlWCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1tzLnRdLnBhZ2VZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh2ID09IHMuY3YpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcy5jSFxuICAgICAgICAgICAgICAgICAgICAmJiAocy5jSCh2KSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgKSByZXR1cm47XG5cblxuICAgICAgICAgICAgICAgIHMuY2hhbmdlKHMuX3ZhbGlkYXRlKHYpKTtcbiAgICAgICAgICAgICAgICBzLl9kcmF3KCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBnZXQgdG91Y2hlcyBpbmRleFxuICAgICAgICAgICAgdGhpcy50ID0gay5jLnQoZSk7XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHRvdWNoXG4gICAgICAgICAgICB0b3VjaE1vdmUoZSk7XG5cbiAgICAgICAgICAgIC8vIFRvdWNoIGV2ZW50cyBsaXN0ZW5lcnNcbiAgICAgICAgICAgIGsuYy5kXG4gICAgICAgICAgICAgICAgLmJpbmQoXCJ0b3VjaG1vdmUua1wiLCB0b3VjaE1vdmUpXG4gICAgICAgICAgICAgICAgLmJpbmQoXG4gICAgICAgICAgICAgICAgICAgIFwidG91Y2hlbmQua1wiXG4gICAgICAgICAgICAgICAgICAgICwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgay5jLmQudW5iaW5kKCd0b3VjaG1vdmUuayB0b3VjaGVuZC5rJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLnJIXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHMuckgocy5jdikgPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHMudmFsKHMuY3YpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fbW91c2UgPSBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICB2YXIgbW91c2VNb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdiA9IHMueHkydmFsKGUucGFnZVgsIGUucGFnZVkpO1xuICAgICAgICAgICAgICAgIGlmICh2ID09IHMuY3YpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcy5jSFxuICAgICAgICAgICAgICAgICAgICAmJiAocy5jSCh2KSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBzLmNoYW5nZShzLl92YWxpZGF0ZSh2KSk7XG4gICAgICAgICAgICAgICAgcy5fZHJhdygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRmlyc3QgY2xpY2tcbiAgICAgICAgICAgIG1vdXNlTW92ZShlKTtcblxuICAgICAgICAgICAgLy8gTW91c2UgZXZlbnRzIGxpc3RlbmVyc1xuICAgICAgICAgICAgay5jLmRcbiAgICAgICAgICAgICAgICAuYmluZChcIm1vdXNlbW92ZS5rXCIsIG1vdXNlTW92ZSlcbiAgICAgICAgICAgICAgICAuYmluZChcbiAgICAgICAgICAgICAgICAgICAgLy8gRXNjYXBlIGtleSBjYW5jZWwgY3VycmVudCBjaGFuZ2VcbiAgICAgICAgICAgICAgICAgICAgXCJrZXl1cC5rXCJcbiAgICAgICAgICAgICAgICAgICAgLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrLmMuZC51bmJpbmQoXCJtb3VzZXVwLmsgbW91c2Vtb3ZlLmsga2V5dXAua1wiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5lSFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAocy5lSCgpID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMuY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmJpbmQoXG4gICAgICAgICAgICAgICAgICAgIFwibW91c2V1cC5rXCJcbiAgICAgICAgICAgICAgICAgICAgLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgay5jLmQudW5iaW5kKCdtb3VzZW1vdmUuayBtb3VzZXVwLmsga2V5dXAuaycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5ySFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChzLnJIKHMuY3YpID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzLnZhbChzLmN2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX3h5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG8gPSB0aGlzLiRjLm9mZnNldCgpO1xuICAgICAgICAgICAgdGhpcy54ID0gby5sZWZ0O1xuICAgICAgICAgICAgdGhpcy55ID0gby50b3A7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9saXN0ZW4gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5vLnJlYWRPbmx5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kY1xuICAgICAgICAgICAgICAgICAgICAuYmluZChcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibW91c2Vkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5feHkoKS5fbW91c2UoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5iaW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b3VjaHN0YXJ0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5feHkoKS5fdG91Y2goZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuJC5hdHRyKCdyZWFkb25seScsICdyZWFkb25seScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9jb25maWd1cmUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIEhvb2tzXG4gICAgICAgICAgICBpZiAodGhpcy5vLmRyYXcpIHRoaXMuZEggPSB0aGlzLm8uZHJhdztcbiAgICAgICAgICAgIGlmICh0aGlzLm8uY2hhbmdlKSB0aGlzLmNIID0gdGhpcy5vLmNoYW5nZTtcbiAgICAgICAgICAgIGlmICh0aGlzLm8uY2FuY2VsKSB0aGlzLmVIID0gdGhpcy5vLmNhbmNlbDtcbiAgICAgICAgICAgIGlmICh0aGlzLm8ucmVsZWFzZSkgdGhpcy5ySCA9IHRoaXMuby5yZWxlYXNlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vLmRpc3BsYXlQcmV2aW91cykge1xuICAgICAgICAgICAgICAgIHRoaXMucENvbG9yID0gdGhpcy5oMnJnYmEodGhpcy5vLmZnQ29sb3IsIFwiMC40XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmdDb2xvciA9IHRoaXMuaDJyZ2JhKHRoaXMuby5mZ0NvbG9yLCBcIjAuNlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZ0NvbG9yID0gdGhpcy5vLmZnQ29sb3I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2NsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy4kY1swXS53aWR0aCA9IHRoaXMuJGNbMF0ud2lkdGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fdmFsaWRhdGUgPSBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICByZXR1cm4gKH5+ICgoKHYgPCAwKSA/IC0wLjUgOiAwLjUpICsgKHYvdGhpcy5vLnN0ZXApKSkgKiB0aGlzLm8uc3RlcDtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBYnN0cmFjdCBtZXRob2RzXG4gICAgICAgIHRoaXMubGlzdGVuID0gZnVuY3Rpb24gKCkge307IC8vIG9uIHN0YXJ0LCBvbmUgdGltZVxuICAgICAgICB0aGlzLmV4dGVuZCA9IGZ1bmN0aW9uICgpIHt9OyAvLyBlYWNoIHRpbWUgY29uZmlndXJlIHRyaWdnZXJlZFxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoKSB7fTsgLy8gZWFjaCB0aW1lIGNvbmZpZ3VyZSB0cmlnZ2VyZWRcbiAgICAgICAgdGhpcy5jaGFuZ2UgPSBmdW5jdGlvbiAodikge307IC8vIG9uIGNoYW5nZVxuICAgICAgICB0aGlzLnZhbCA9IGZ1bmN0aW9uICh2KSB7fTsgLy8gb24gcmVsZWFzZVxuICAgICAgICB0aGlzLnh5MnZhbCA9IGZ1bmN0aW9uICh4LCB5KSB7fTsgLy9cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge307IC8vIG9uIGNoYW5nZSAvIG9uIHJlbGVhc2VcbiAgICAgICAgdGhpcy5jbGVhciA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fY2xlYXIoKTsgfTtcblxuICAgICAgICAvLyBVdGlsc1xuICAgICAgICB0aGlzLmgycmdiYSA9IGZ1bmN0aW9uIChoLCBhKSB7XG4gICAgICAgICAgICB2YXIgcmdiO1xuICAgICAgICAgICAgaCA9IGguc3Vic3RyaW5nKDEsNylcbiAgICAgICAgICAgIHJnYiA9IFtwYXJzZUludChoLnN1YnN0cmluZygwLDIpLDE2KVxuICAgICAgICAgICAgICAgICAgICxwYXJzZUludChoLnN1YnN0cmluZygyLDQpLDE2KVxuICAgICAgICAgICAgICAgICAgICxwYXJzZUludChoLnN1YnN0cmluZyg0LDYpLDE2KV07XG4gICAgICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgcmdiWzBdICsgXCIsXCIgKyByZ2JbMV0gKyBcIixcIiArIHJnYlsyXSArIFwiLFwiICsgYSArIFwiKVwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY29weSA9IGZ1bmN0aW9uIChmLCB0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGYpIHsgdFtpXSA9IGZbaV07IH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBrLkRpYWxcbiAgICAgKi9cbiAgICBrLkRpYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGsuby5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3RhcnRBbmdsZSA9IG51bGw7XG4gICAgICAgIHRoaXMueHkgPSBudWxsO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IG51bGw7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5jdXJzb3JFeHQgPSBudWxsO1xuICAgICAgICB0aGlzLncyID0gbnVsbDtcbiAgICAgICAgdGhpcy5QSTIgPSAyKk1hdGguUEk7XG5cbiAgICAgICAgdGhpcy5leHRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm8gPSAkLmV4dGVuZChcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJnQ29sb3IgOiB0aGlzLiQuZGF0YSgnYmdjb2xvcicpIHx8ICcjRUVFRUVFJyxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVPZmZzZXQgOiB0aGlzLiQuZGF0YSgnYW5nbGVvZmZzZXQnKSB8fCAwLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZUFyYyA6IHRoaXMuJC5kYXRhKCdhbmdsZWFyYycpIHx8IDM2MCxcbiAgICAgICAgICAgICAgICAgICAgaW5saW5lIDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sIHRoaXMub1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnZhbCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSB2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdiA9IHRoaXMuby5zdG9wcGVyID8gbWF4KG1pbih2LCB0aGlzLm8ubWF4KSwgdGhpcy5vLm1pbikgOiB2O1xuICAgICAgICAgICAgICAgIHRoaXMudiA9IHRoaXMuY3Y7XG4gICAgICAgICAgICAgICAgdGhpcy4kLnZhbCh0aGlzLnYpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnh5MnZhbCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICB2YXIgYSwgcmV0O1xuXG4gICAgICAgICAgICBhID0gTWF0aC5hdGFuMihcbiAgICAgICAgICAgICAgICAgICAgICAgIHggLSAodGhpcy54ICsgdGhpcy53MilcbiAgICAgICAgICAgICAgICAgICAgICAgICwgLSAoeSAtIHRoaXMueSAtIHRoaXMudzIpXG4gICAgICAgICAgICAgICAgICAgICkgLSB0aGlzLmFuZ2xlT2Zmc2V0O1xuXG4gICAgICAgICAgICBpZih0aGlzLmFuZ2xlQXJjICE9IHRoaXMuUEkyICYmIChhIDwgMCkgJiYgKGEgPiAtMC41KSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGlzc2V0IGFuZ2xlQXJjIG9wdGlvbiwgc2V0IHRvIG1pbiBpZiAuNSB1bmRlciBtaW5cbiAgICAgICAgICAgICAgICBhID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYSA8IDApIHtcbiAgICAgICAgICAgICAgICBhICs9IHRoaXMuUEkyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXQgPSB+fiAoMC41ICsgKGEgKiAodGhpcy5vLm1heCAtIHRoaXMuby5taW4pIC8gdGhpcy5hbmdsZUFyYykpXG4gICAgICAgICAgICAgICAgICAgICsgdGhpcy5vLm1pbjtcblxuICAgICAgICAgICAgdGhpcy5vLnN0b3BwZXJcbiAgICAgICAgICAgICYmIChyZXQgPSBtYXgobWluKHJldCwgdGhpcy5vLm1heCksIHRoaXMuby5taW4pKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxpc3RlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGJpbmQgTW91c2VXaGVlbFxuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLFxuICAgICAgICAgICAgICAgIG13ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9yaSA9IGUub3JpZ2luYWxFdmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZGVsdGFYID0gb3JpLmRldGFpbCB8fCBvcmkud2hlZWxEZWx0YVhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGRlbHRhWSA9IG9yaS5kZXRhaWwgfHwgb3JpLndoZWVsRGVsdGFZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICx2ID0gcGFyc2VJbnQocy4kLnZhbCgpKSArIChkZWx0YVg+MCB8fCBkZWx0YVk+MCA/IHMuby5zdGVwIDogZGVsdGFYPDAgfHwgZGVsdGFZPDAgPyAtcy5vLnN0ZXAgOiAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5jSFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAocy5jSCh2KSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcy52YWwodik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLCBrdmFsLCB0bywgbSA9IDEsIGt2ID0gezM3Oi1zLm8uc3RlcCwgMzg6cy5vLnN0ZXAsIDM5OnMuby5zdGVwLCA0MDotcy5vLnN0ZXB9O1xuXG4gICAgICAgICAgICB0aGlzLiRcbiAgICAgICAgICAgICAgICAuYmluZChcbiAgICAgICAgICAgICAgICAgICAgXCJrZXlkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgLGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2MgPSBlLmtleUNvZGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG51bXBhZCBzdXBwb3J0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihrYyA+PSA5NiAmJiBrYyA8PSAxMDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrYyA9IGUua2V5Q29kZSA9IGtjIC0gNDg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGt2YWwgPSBwYXJzZUludChTdHJpbmcuZnJvbUNoYXJDb2RlKGtjKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihrdmFsKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtjICE9PSAxMykgICAgICAgICAvLyBlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChrYyAhPT0gOCkgICAgICAgLy8gYnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoa2MgIT09IDkpICAgICAgIC8vIHRhYlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChrYyAhPT0gMTg5KSAgICAgLy8gLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFycm93c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoa2MsWzM3LDM4LDM5LDQwXSkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSBwYXJzZUludChzLiQudmFsKCkpICsga3Zba2NdICogbTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLm8uc3RvcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAodiA9IG1heChtaW4odiwgcy5vLm1heCksIHMuby5taW4pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLmNoYW5nZSh2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcy5fZHJhdygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvbmcgdGltZSBrZXlkb3duIHNwZWVkLXVwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvID0gd2luZG93LnNldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IG0qPTI7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwzMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAuYmluZChcbiAgICAgICAgICAgICAgICAgICAgXCJrZXl1cFwiXG4gICAgICAgICAgICAgICAgICAgICxmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKGt2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLnZhbChzLiQudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga3ZhbCBwb3N0Y29uZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzLiQudmFsKCkgPiBzLm8ubWF4ICYmIHMuJC52YWwocy5vLm1heCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKHMuJC52YWwoKSA8IHMuby5taW4gJiYgcy4kLnZhbChzLm8ubWluKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLiRjLmJpbmQoXCJtb3VzZXdoZWVsIERPTU1vdXNlU2Nyb2xsXCIsIG13KTtcbiAgICAgICAgICAgIHRoaXMuJC5iaW5kKFwibW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbFwiLCBtdylcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnYgPCB0aGlzLm8ubWluXG4gICAgICAgICAgICAgICAgfHwgdGhpcy52ID4gdGhpcy5vLm1heFxuICAgICAgICAgICAgKSB0aGlzLnYgPSB0aGlzLm8ubWluO1xuXG4gICAgICAgICAgICB0aGlzLiQudmFsKHRoaXMudik7XG4gICAgICAgICAgICB0aGlzLncyID0gdGhpcy5vLndpZHRoIC8gMjtcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yRXh0ID0gdGhpcy5vLmN1cnNvciAvIDEwMDtcbiAgICAgICAgICAgIHRoaXMueHkgPSB0aGlzLncyO1xuICAgICAgICAgICAgdGhpcy5saW5lV2lkdGggPSB0aGlzLnh5ICogdGhpcy5vLnRoaWNrbmVzcztcbiAgICAgICAgICAgIHRoaXMubGluZUNhcCA9IHRoaXMuby5saW5lQ2FwO1xuICAgICAgICAgICAgdGhpcy5yYWRpdXMgPSB0aGlzLnh5IC0gdGhpcy5saW5lV2lkdGggLyAyO1xuXG4gICAgICAgICAgICB0aGlzLm8uYW5nbGVPZmZzZXRcbiAgICAgICAgICAgICYmICh0aGlzLm8uYW5nbGVPZmZzZXQgPSBpc05hTih0aGlzLm8uYW5nbGVPZmZzZXQpID8gMCA6IHRoaXMuby5hbmdsZU9mZnNldCk7XG5cbiAgICAgICAgICAgIHRoaXMuby5hbmdsZUFyY1xuICAgICAgICAgICAgJiYgKHRoaXMuby5hbmdsZUFyYyA9IGlzTmFOKHRoaXMuby5hbmdsZUFyYykgPyB0aGlzLlBJMiA6IHRoaXMuby5hbmdsZUFyYyk7XG5cbiAgICAgICAgICAgIC8vIGRlZyB0byByYWRcbiAgICAgICAgICAgIHRoaXMuYW5nbGVPZmZzZXQgPSB0aGlzLm8uYW5nbGVPZmZzZXQgKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgICAgICAgdGhpcy5hbmdsZUFyYyA9IHRoaXMuby5hbmdsZUFyYyAqIE1hdGguUEkgLyAxODA7XG5cbiAgICAgICAgICAgIC8vIGNvbXB1dGUgc3RhcnQgYW5kIGVuZCBhbmdsZXNcbiAgICAgICAgICAgIHRoaXMuc3RhcnRBbmdsZSA9IDEuNSAqIE1hdGguUEkgKyB0aGlzLmFuZ2xlT2Zmc2V0O1xuICAgICAgICAgICAgdGhpcy5lbmRBbmdsZSA9IDEuNSAqIE1hdGguUEkgKyB0aGlzLmFuZ2xlT2Zmc2V0ICsgdGhpcy5hbmdsZUFyYztcblxuICAgICAgICAgICAgdmFyIHMgPSBtYXgoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nKE1hdGguYWJzKHRoaXMuby5tYXgpKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIFN0cmluZyhNYXRoLmFicyh0aGlzLm8ubWluKSkubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLCAyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSArIDI7XG5cbiAgICAgICAgICAgIHRoaXMuby5kaXNwbGF5SW5wdXRcbiAgICAgICAgICAgICAgICAmJiB0aGlzLmkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCcgOiAoKHRoaXMuby53aWR0aCAvIDIgKyA0KSA+PiAwKSArICdweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICwnaGVpZ2h0JyA6ICgodGhpcy5vLndpZHRoIC8gMykgPj4gMCkgKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAsJ3Bvc2l0aW9uJyA6ICdhYnNvbHV0ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICwndmVydGljYWwtYWxpZ24nIDogJ21pZGRsZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICwnbWFyZ2luLXRvcCcgOiAoKHRoaXMuby53aWR0aCAvIDMpID4+IDApICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICAgICAgLCdtYXJnaW4tbGVmdCcgOiAnLScgKyAoKHRoaXMuby53aWR0aCAqIDMgLyA0ICsgMikgPj4gMCkgKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAsJ2JvcmRlcicgOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAsJ2JhY2tncm91bmQnIDogJ25vbmUnXG4gICAgICAgICAgICAgICAgICAgICAgICAsJ2ZvbnQnIDogJ2JvbGQgJyArICgodGhpcy5vLndpZHRoIC8gcykgPj4gMCkgKyAncHggQXJpYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICAsJ3RleHQtYWxpZ24nIDogJ2NlbnRlcidcbiAgICAgICAgICAgICAgICAgICAgICAgICwnY29sb3InIDogdGhpcy5vLmlucHV0Q29sb3IgfHwgdGhpcy5vLmZnQ29sb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICwncGFkZGluZycgOiAnMHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgLCctd2Via2l0LWFwcGVhcmFuY2UnOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfHwgdGhpcy5pLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnIDogJzBweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICwndmlzaWJpbGl0eScgOiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jaGFuZ2UgPSBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgdGhpcy5jdiA9IHY7XG4gICAgICAgICAgICB0aGlzLiQudmFsKHYpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYW5nbGUgPSBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgcmV0dXJuICh2IC0gdGhpcy5vLm1pbikgKiB0aGlzLmFuZ2xlQXJjIC8gKHRoaXMuby5tYXggLSB0aGlzLm8ubWluKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5nLCAgICAgICAgICAgICAgICAgLy8gY29udGV4dFxuICAgICAgICAgICAgICAgIGEgPSB0aGlzLmFuZ2xlKHRoaXMuY3YpICAgIC8vIEFuZ2xlXG4gICAgICAgICAgICAgICAgLCBzYXQgPSB0aGlzLnN0YXJ0QW5nbGUgICAgIC8vIFN0YXJ0IGFuZ2xlXG4gICAgICAgICAgICAgICAgLCBlYXQgPSBzYXQgKyBhICAgICAgICAgICAgIC8vIEVuZCBhbmdsZVxuICAgICAgICAgICAgICAgICwgc2EsIGVhICAgICAgICAgICAgICAgICAgICAvLyBQcmV2aW91cyBhbmdsZXNcbiAgICAgICAgICAgICAgICAsIHIgPSAxO1xuXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuXG4gICAgICAgICAgICBjLmxpbmVDYXAgPSB0aGlzLmxpbmVDYXA7XG5cbiAgICAgICAgICAgIHRoaXMuby5jdXJzb3JcbiAgICAgICAgICAgICAgICAmJiAoc2F0ID0gZWF0IC0gdGhpcy5jdXJzb3JFeHQpXG4gICAgICAgICAgICAgICAgJiYgKGVhdCA9IGVhdCArIHRoaXMuY3Vyc29yRXh0KTtcblxuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gdGhpcy5vLmJnQ29sb3I7XG4gICAgICAgICAgICAgICAgYy5hcmModGhpcy54eSwgdGhpcy54eSwgdGhpcy5yYWRpdXMsIHRoaXMuZW5kQW5nbGUgLSAwLjAwMDAxLCB0aGlzLnN0YXJ0QW5nbGUgKyAwLjAwMDAxLCB0cnVlKTtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm8uZGlzcGxheVByZXZpb3VzKSB7XG4gICAgICAgICAgICAgICAgZWEgPSB0aGlzLnN0YXJ0QW5nbGUgKyB0aGlzLmFuZ2xlKHRoaXMudik7XG4gICAgICAgICAgICAgICAgc2EgPSB0aGlzLnN0YXJ0QW5nbGU7XG4gICAgICAgICAgICAgICAgdGhpcy5vLmN1cnNvclxuICAgICAgICAgICAgICAgICAgICAmJiAoc2EgPSBlYSAtIHRoaXMuY3Vyc29yRXh0KVxuICAgICAgICAgICAgICAgICAgICAmJiAoZWEgPSBlYSArIHRoaXMuY3Vyc29yRXh0KTtcblxuICAgICAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIGMuc3Ryb2tlU3R5bGUgPSB0aGlzLnBDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgYy5hcmModGhpcy54eSwgdGhpcy54eSwgdGhpcy5yYWRpdXMsIHNhLCBlYSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgciA9ICh0aGlzLmN2ID09IHRoaXMudik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgYy5zdHJva2VTdHlsZSA9IHIgPyB0aGlzLm8uZmdDb2xvciA6IHRoaXMuZmdDb2xvciA7XG4gICAgICAgICAgICAgICAgYy5hcmModGhpcy54eSwgdGhpcy54eSwgdGhpcy5yYWRpdXMsIHNhdCwgZWF0LCBmYWxzZSk7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy52YWwodGhpcy52KTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgJC5mbi5kaWFsID0gJC5mbi5rbm9iID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgdmFyIGQgPSBuZXcgay5EaWFsKCk7XG4gICAgICAgIGQubyA9IG87XG4gICAgICAgIGQuJCA9ICQodGhpcyk7XG4gICAgICAgIGQucnVuKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGQpO1xuICAgICAgICByZXR1cm4gZDtcbiAgICB9O1xuXG59KShqUXVlcnkpO1xuIl19
