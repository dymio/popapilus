// Popapilus v0.8 - jQuery plugin for creating popups: modal windows, hints etc.
// sources, description and demos - on http://github.com/dymio/popapilus
// Author: Ivan Dymkov aka Dymio
// Site: http://dymio.net
// Email: mstrdymio[at]gmail.com
(function() {

  /*
   * Class for overlay
   */
  function PopapilusOverlay(options) {
    var self = this;

    var overlay = null;
    var _is_visible = false;

    this.onClickFunction = null;

    this.show = function(show_options) {
      if (_is_visible) return false;
      show_options = show_options || options;
      overlay.fadeIn(show_options.overlay_show_animation_speed);
      _is_visible = true;
    }
    this.hide = function() {
      if (!_is_visible) return false;
      //show_options = show_options || options;
      //overlay.fadeOut(show_options.overlay_show_animation_speed);
      overlay.hide();
      _is_visible = false;
    }

    this.init = function() {
      $("body").append('<div class="' + options.overlay_css_class + '"></div>');

      overlay = $("body ." + options.overlay_css_class + ":last");
      
      overlay.css({
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'z-index': options.overlay_z_index
      });

      overlay.click(function(evnt) {
        evnt.preventDefault();
        if (self.onClickFunction)
          self.onClickFunction(evnt);
      });
    }

    this.init();
  }

  /*
   * Main popapilus class
   */
  function Popapilus(options) {
    var self = this;

    var overlay = null;
    var holder = null;

    var _is_visible = false;

    this.__defineGetter__("is_visible", function() { return _is_visible; });

    function centerHolder(show_options) {
      show_options = show_options || options;

      // by x axis
      holder.css('left', Math.max(0, ($(window).width() / 2) - (holder.width() / 2)).toString() + 'px' );

      // by y axis if position is 'fixed'
      if (show_options.fixed)
        holder.css('top', Math.max(0, ($(window).height() / 2) - (holder.height() / 2)).toString() + 'px' );
    }


    function setHolderStyles(show_options) {
      show_options = show_options || options;

      // clear old styles
      holder.attr('style', 'display: none;');

      holder.css({
        position: show_options.fixed ? 'fixed' : 'absolute',
        'z-index': show_options.z_index
      });

      if (show_options.width !== null) holder.css('width', show_options.width);
      if (show_options.height !== null) holder.css('height', show_options.height);

      if (!show_options.centered) {
        if (show_options.top !== null) holder.css('top', show_options.top);
        if (show_options.bottom !== null) holder.css('bottom', show_options.bottom);
      }
      if (!show_options.centered || (show_options.centered && !show_options.fixed)) {
        if (show_options.right !== null) holder.css('right', show_options.right);
        if (show_options.left !== null) holder.css('left', show_options.left);
      }
    }

    function refreshPopapilus() {
      $(window).unbind('resize');
      if (overlay) overlay.onClickFunction = null;
    }

    /*
     * Show popapilus
     */
    this.show = function(data, show_options) {
      show_options = jQuery.extend(options, show_options);
      if (_is_visible) refreshPopapilus();

      if (data) {
        holder.html(data);
      }

      setHolderStyles(show_options);

      if (show_options.close_on_overlay_click && overlay) {
        overlay.onClickFunction = function(evnt) {
          self.hide();
        }
      }

      if (show_options.modal && overlay) {
        overlay.show(show_options);
      }

      if (show_options.centered) {
        $(window).resize(function() { centerHolder(show_options); });
        centerHolder(show_options);
      }

      if (!_is_visible)
        holder.fadeIn(show_options.show_animation_speed);

      _is_visible = true;

      if (show_options.autoclose_time) {
        setTimeout(function() {
          self.hide();
        }, show_options.autoclose_time);
      }
    }

    /*
     * Hide popapilus
     */
    this.hide = function() {
      refreshPopapilus();
      holder.hide();
      if (overlay) overlay.hide();
      _is_visible = false;
    }

    /* 
     * Initialize function
     */
    this.init = function() {
      if (!options.no_overlay) {
        overlay = new PopapilusOverlay(options);
      }
      
      // create popapilus block
      $("body").append('<div class="' + options.css_class + '"></div>');
      holder = $("body ." + options.css_class + ":last");
      setHolderStyles();
    }

    // rock'n'roll
    this.init();
  }

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  jQuery.popapilus = function(options) {
    var options = jQuery.extend({
      // overlay options
      // * = only for init, not to show
      no_overlay:                   false, // *
      overlay_css_class:            'popapilus_overlay', // *
      overlay_z_index:              3998, // *
      overlay_show_animation_speed: 0,
      close_on_overlay_click:       true,

      // class
      css_class: 'popapilus', // *

      // position and size options
      fixed:    true,  // 'fixed' or 'absolute'
      z_index:  3999,
      modal:    true,  // work only with no_overlay = false
      centered: true,  // always work by x axis and work by y axis if fixed = true
      top:      null,  // work with centered = false or centered = true and fixed = false
      right:    null,  // work with centered = false
      bottom:   null,  // work with centered = false or centered = true and fixed = false
      left:     null,  // work with centered = false
      width:    null,
      height:   null,

      // animation
      show_animation_speed: 0,

      // autoclose
      autoclose_time: 0
    }, options);

    return new Popapilus(options);
  };

}).call(this);