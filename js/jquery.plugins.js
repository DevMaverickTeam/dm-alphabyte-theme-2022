/*
 * Simple Mobile Navigation
 */
(function ($) {
  function MobileNav(options) {
    this.options = $.extend({
        container: null,
        hideOnClickOutside: false,
        menuActiveClass: "nav-active",
        menuOpener: ".nav-opener",
        menuDrop: ".nav-drop",
        toggleEvent: "click",
        outsideClickEvent: "click touchstart pointerdown MSPointerDown",
      },
      options
    );
    this.initStructure();
    this.attachEvents();
  }
  MobileNav.prototype = {
    initStructure: function () {
      this.page = $("html");
      this.container = $(this.options.container);
      this.opener = this.container.find(this.options.menuOpener);
      this.drop = this.container.find(this.options.menuDrop);
    },
    attachEvents: function () {
      var self = this;

      if (activateResizeHandler) {
        activateResizeHandler();
        activateResizeHandler = null;
      }

      this.outsideClickHandler = function (e) {
        if (self.isOpened()) {
          var target = $(e.target);
          if (
            !target.closest(self.opener).length &&
            !target.closest(self.drop).length
          ) {
            self.hide();
          }
        }
      };

      this.openerClickHandler = function (e) {
        e.preventDefault();
        self.toggle();
      };

      this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function () {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function () {
      this.container.addClass(this.options.menuActiveClass);
      if (this.options.hideOnClickOutside) {
        this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    hide: function () {
      this.container.removeClass(this.options.menuActiveClass);
      if (this.options.hideOnClickOutside) {
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    toggle: function () {
      if (this.isOpened()) {
        this.hide();
      } else {
        this.show();
      }
    },
    destroy: function () {
      this.container.removeClass(this.options.menuActiveClass);
      this.opener.off(this.options.toggleEvent, this.clickHandler);
      this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    },
  };

  var activateResizeHandler = function () {
    var win = $(window),
      doc = $("html"),
      resizeClass = "resize-active",
      flag,
      timer;
    var removeClassHandler = function () {
      flag = false;
      doc.removeClass(resizeClass);
    };
    var resizeHandler = function () {
      if (!flag) {
        flag = true;
        doc.addClass(resizeClass);
      }
      clearTimeout(timer);
      timer = setTimeout(removeClassHandler, 500);
    };
    win.on("resize orientationchange", resizeHandler);
  };

  $.fn.mobileNav = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function () {
      var $container = jQuery(this);
      var instance = $container.data("MobileNav");

      if (typeof opt === "object" || typeof opt === "undefined") {
        $container.data(
          "MobileNav",
          new MobileNav(
            $.extend({
                container: this,
              },
              opt
            )
          )
        );
      } else if (typeof method === "string" && instance) {
        if (typeof instance[method] === "function") {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
})(jQuery);

/*
 * Responsive Layout helper
 */
window.ResponsiveHelper = (function ($) {
  // init variables
  var handlers = [],
    prevWinWidth,
    win = $(window),
    nativeMatchMedia = false;

  // detect match media support
  if (window.matchMedia) {
    if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
      nativeMatchMedia = true;
    } else if (window.matchMedia.toString().indexOf("native") > -1) {
      nativeMatchMedia = true;
    }
  }

  // prepare resize handler
  function resizeHandler() {
    var winWidth = win.width();
    if (winWidth !== prevWinWidth) {
      prevWinWidth = winWidth;

      // loop through range groups
      $.each(handlers, function (index, rangeObject) {
        // disable current active area if needed
        $.each(rangeObject.data, function (property, item) {
          if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
            item.currentActive = false;
            if (typeof item.disableCallback === "function") {
              item.disableCallback();
            }
          }
        });

        // enable areas that match current width
        $.each(rangeObject.data, function (property, item) {
          if (!item.currentActive && matchRange(item.range[0], item.range[1])) {
            // make callback
            item.currentActive = true;
            if (typeof item.enableCallback === "function") {
              item.enableCallback();
            }
          }
        });
      });
    }
  }
  win.bind("load resize orientationchange", resizeHandler);

  // test range
  function matchRange(r1, r2) {
    var mediaQueryString = "";
    if (r1 > 0) {
      mediaQueryString += "(min-width: " + r1 + "px)";
    }
    if (r2 < Infinity) {
      mediaQueryString +=
        (mediaQueryString ? " and " : "") + "(max-width: " + r2 + "px)";
    }
    return matchQuery(mediaQueryString, r1, r2);
  }

  // media query function
  function matchQuery(query, r1, r2) {
    if (window.matchMedia && nativeMatchMedia) {
      return matchMedia(query).matches;
    } else if (window.styleMedia) {
      return styleMedia.matchMedium(query);
    } else if (window.media) {
      return media.matchMedium(query);
    } else {
      return prevWinWidth >= r1 && prevWinWidth <= r2;
    }
  }

  // range parser
  function parseRange(rangeStr) {
    var rangeData = rangeStr.split("..");
    var x1 = parseInt(rangeData[0], 10) || -Infinity;
    var x2 = parseInt(rangeData[1], 10) || Infinity;
    return [x1, x2].sort(function (a, b) {
      return a - b;
    });
  }

  // export public functions
  return {
    addRange: function (ranges) {
      // parse data and add items to collection
      var result = {
        data: {},
      };
      $.each(ranges, function (property, data) {
        result.data[property] = {
          range: parseRange(property),
          enableCallback: data.on,
          disableCallback: data.off,
        };
      });
      handlers.push(result);

      // call resizeHandler to recalculate all events
      prevWinWidth = null;
      resizeHandler();
    },
  };
})(jQuery);

/*!
 * SmoothScroll module
 */
(function ($, exports) {
  // private variables
  var page,
    win = $(window),
    activeBlock,
    activeWheelHandler,
    wheelEvents =
    "onwheel" in document || document.documentMode >= 9 ?
    "wheel" :
    "mousewheel DOMMouseScroll";

  // animation handlers
  function scrollTo(offset, options, callback) {
    // initialize variables
    var scrollBlock;
    if (document.body) {
      if (typeof options === "number") {
        options = {
          duration: options,
        };
      } else {
        options = options || {};
      }
      page = page || $("html, body");
      scrollBlock = options.container || page;
    } else {
      return;
    }

    // treat single number as scrollTop
    if (typeof offset === "number") {
      offset = {
        top: offset,
      };
    }

    // handle mousewheel/trackpad while animation is active
    if (activeBlock && activeWheelHandler) {
      activeBlock.off(wheelEvents, activeWheelHandler);
    }
    if (options.wheelBehavior && options.wheelBehavior !== "none") {
      activeWheelHandler = function (e) {
        if (options.wheelBehavior === "stop") {
          scrollBlock.off(wheelEvents, activeWheelHandler);
          scrollBlock.stop();
        } else if (options.wheelBehavior === "ignore") {
          e.preventDefault();
        }
      };
      activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
    }

    // start scrolling animation
    scrollBlock.stop().animate({
        scrollLeft: offset.left,
        scrollTop: offset.top,
      },
      options.duration,
      function () {
        if (activeWheelHandler) {
          scrollBlock.off(wheelEvents, activeWheelHandler);
        }
        if ($.isFunction(callback)) {
          callback();
        }
      }
    );
  }

  // smooth scroll contstructor
  function SmoothScroll(options) {
    this.options = $.extend({
        anchorLinks: 'a[href^="#"]', // selector or jQuery object
        container: null, // specify container for scrolling (default - whole page)
        extraOffset: null, // function or fixed number
        activeClasses: null, // null, "link", "parent"
        easing: "swing", // easing of scrolling
        animMode: "duration", // or "speed" mode
        animDuration: 800, // total duration for scroll (any distance)
        animSpeed: 1500, // pixels per second
        anchorActiveClass: "anchor-active",
        sectionActiveClass: "section-active",
        wheelBehavior: "stop", // "stop", "ignore" or "none"
        useNativeAnchorScrolling: false, // do not handle click in devices with native smooth scrolling
      },
      options
    );
    this.init();
  }
  SmoothScroll.prototype = {
    init: function () {
      this.initStructure();
      this.attachEvents();
      this.isInit = true;
    },
    initStructure: function () {
      var self = this;

      this.container = this.options.container ?
        $(this.options.container) :
        $("html,body");
      this.scrollContainer = this.options.container ? this.container : win;
      this.anchorLinks = jQuery(this.options.anchorLinks).filter(function () {
        return jQuery(self.getAnchorTarget(jQuery(this))).length;
      });
    },
    getId: function (str) {
      try {
        return "#" + str.replace(/^.*?(#|$)/, "");
      } catch (err) {
        return null;
      }
    },
    getAnchorTarget: function (link) {
      // get target block from link href
      var targetId = this.getId($(link).attr("href"));
      return $(targetId.length > 1 ? targetId : "html");
    },
    getTargetOffset: function (block) {
      // get target offset
      var blockOffset = block.offset().top;
      if (this.options.container) {
        blockOffset -=
          this.container.offset().top - this.container.prop("scrollTop");
      }

      // handle extra offset
      if (typeof this.options.extraOffset === "number") {
        blockOffset -= this.options.extraOffset;
      } else if (typeof this.options.extraOffset === "function") {
        blockOffset -= this.options.extraOffset(block);
      }
      return {
        top: blockOffset,
      };
    },
    attachEvents: function () {
      var self = this;

      // handle active classes
      if (this.options.activeClasses && this.anchorLinks.length) {
        // cache structure
        this.anchorData = [];

        for (var i = 0; i < this.anchorLinks.length; i++) {
          var link = jQuery(this.anchorLinks[i]),
            targetBlock = self.getAnchorTarget(link),
            anchorDataItem = null;

          $.each(self.anchorData, function (index, item) {
            if (item.block[0] === targetBlock[0]) {
              anchorDataItem = item;
            }
          });

          if (anchorDataItem) {
            anchorDataItem.link = anchorDataItem.link.add(link);
          } else {
            self.anchorData.push({
              link: link,
              block: targetBlock,
            });
          }
        }

        // add additional event handlers
        this.resizeHandler = function () {
          if (!self.isInit) return;
          self.recalculateOffsets();
        };
        this.scrollHandler = function () {
          self.refreshActiveClass();
        };

        this.recalculateOffsets();
        this.scrollContainer.on("scroll", this.scrollHandler);
        win.on(
          "resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll",
          this.resizeHandler
        );
      }

      // handle click event
      this.clickHandler = function (e) {
        self.onClick(e);
      };
      if (!this.options.useNativeAnchorScrolling) {
        this.anchorLinks.on("click", this.clickHandler);
      }
    },
    recalculateOffsets: function () {
      var self = this;
      $.each(this.anchorData, function (index, data) {
        data.offset = self.getTargetOffset(data.block);
        data.height = data.block.outerHeight();
      });
      this.refreshActiveClass();
    },
    toggleActiveClass: function (anchor, block, state) {
      anchor.toggleClass(this.options.anchorActiveClass, state);
      block.toggleClass(this.options.sectionActiveClass, state);
    },
    refreshActiveClass: function () {
      var self = this,
        foundFlag = false,
        containerHeight = this.container.prop("scrollHeight"),
        viewPortHeight = this.scrollContainer.height(),
        scrollTop = this.options.container ?
        this.container.prop("scrollTop") :
        win.scrollTop();

      // user function instead of default handler
      if (this.options.customScrollHandler) {
        this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
        return;
      }

      // sort anchor data by offsets
      this.anchorData.sort(function (a, b) {
        return a.offset.top - b.offset.top;
      });

      // default active class handler
      $.each(this.anchorData, function (index) {
        var reverseIndex = self.anchorData.length - index - 1,
          data = self.anchorData[reverseIndex],
          anchorElement =
          self.options.activeClasses === "parent" ?
          data.link.parent() :
          data.link;

        if (scrollTop >= containerHeight - viewPortHeight) {
          // handle last section
          if (reverseIndex === self.anchorData.length - 1) {
            self.toggleActiveClass(anchorElement, data.block, true);
          } else {
            self.toggleActiveClass(anchorElement, data.block, false);
          }
        } else {
          // handle other sections
          if (
            !foundFlag &&
            (scrollTop >= data.offset.top - 1 || reverseIndex === 0)
          ) {
            foundFlag = true;
            self.toggleActiveClass(anchorElement, data.block, true);
          } else {
            self.toggleActiveClass(anchorElement, data.block, false);
          }
        }
      });
    },
    calculateScrollDuration: function (offset) {
      var distance;
      if (this.options.animMode === "speed") {
        distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
        return (distance / this.options.animSpeed) * 1000;
      } else {
        return this.options.animDuration;
      }
    },
    onClick: function (e) {
      var targetBlock = this.getAnchorTarget(e.currentTarget),
        targetOffset = this.getTargetOffset(targetBlock);

      e.preventDefault();
      scrollTo(targetOffset, {
        container: this.container,
        wheelBehavior: this.options.wheelBehavior,
        duration: this.calculateScrollDuration(targetOffset),
      });
      this.makeCallback("onBeforeScroll", e.currentTarget);
    },
    makeCallback: function (name) {
      if (typeof this.options[name] === "function") {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },
    destroy: function () {
      var self = this;

      this.isInit = false;
      if (this.options.activeClasses) {
        win.off(
          "resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll",
          this.resizeHandler
        );
        this.scrollContainer.off("scroll", this.scrollHandler);
        $.each(this.anchorData, function (index) {
          var reverseIndex = self.anchorData.length - index - 1,
            data = self.anchorData[reverseIndex],
            anchorElement =
            self.options.activeClasses === "parent" ?
            data.link.parent() :
            data.link;

          self.toggleActiveClass(anchorElement, data.block, false);
        });
      }
      this.anchorLinks.off("click", this.clickHandler);
    },
  };

  // public API
  $.extend(SmoothScroll, {
    scrollTo: function (blockOrOffset, durationOrOptions, callback) {
      scrollTo(blockOrOffset, durationOrOptions, callback);
    },
  });

  // export module
  exports.SmoothScroll = SmoothScroll;
})(jQuery, this);

/*
 * jQuery sticky box plugin
 */
(function ($, $win) {
  "use strict";

  function StickyScrollBlock($stickyBox, options) {
    this.options = options;
    this.$stickyBox = $stickyBox;
    this.init();
  }

  var StickyScrollBlockPrototype = {
    init: function () {
      this.findElements();
      this.attachEvents();
      this.makeCallback("onInit");
    },

    findElements: function () {
      // find parent container in which will be box move
      this.$container = this.$stickyBox.closest(this.options.container);
      // define box wrap flag
      this.isWrap =
        this.options.positionType === "fixed" && this.options.setBoxHeight;
      // define box move flag
      this.moveInContainer = !!this.$container.length;
      // wrapping box to set place in content
      if (this.isWrap) {
        this.$stickyBoxWrap = this.$stickyBox
          .wrap('<div class="' + this.getWrapClass() + '"/>')
          .parent();
      }
      //define block to add active class
      this.parentForActive = this.getParentForActive();
      this.isInit = true;
    },

    attachEvents: function () {
      var self = this;

      // bind events
      this.onResize = function () {
        if (!self.isInit) return;
        self.resetState();
        self.recalculateOffsets();
        self.checkStickyPermission();
        self.scrollHandler();
      };

      this.onScroll = function () {
        self.scrollHandler();
      };

      // initial handler call
      this.onResize();

      // handle events
      $win
        .on("load resize orientationchange", this.onResize)
        .on("scroll", this.onScroll);
    },

    defineExtraTop: function () {
      // define box's extra top dimension
      var extraTop;

      if (typeof this.options.extraTop === "number") {
        extraTop = this.options.extraTop;
      } else if (typeof this.options.extraTop === "function") {
        extraTop = this.options.extraTop();
      }

      this.extraTop =
        this.options.positionType === "absolute" ?
        extraTop :
        Math.min(this.winParams.height - this.data.boxFullHeight, extraTop);
    },

    checkStickyPermission: function () {
      // check the permission to set sticky
      this.isStickyEnabled = this.moveInContainer ?
        this.data.containerOffsetTop + this.data.containerHeight >
        this.data.boxFullHeight +
        this.data.boxOffsetTop +
        this.options.extraBottom :
        true;
    },

    getParentForActive: function () {
      if (this.isWrap) {
        return this.$stickyBoxWrap;
      }

      if (this.$container.length) {
        return this.$container;
      }

      return this.$stickyBox;
    },

    getWrapClass: function () {
      // get set of container classes
      try {
        return this.$stickyBox
          .attr("class")
          .split(" ")
          .map(function (name) {
            return "sticky-wrap-" + name;
          })
          .join(" ");
      } catch (err) {
        return "sticky-wrap";
      }
    },

    resetState: function () {
      // reset dimensions and state
      this.stickyFlag = false;
      this.$stickyBox
        .css({
          "-webkit-transition": "",
          "-webkit-transform": "",
          transition: "",
          transform: "",
          position: "",
          width: "",
          left: "",
          top: "",
        })
        .removeClass(this.options.activeClass);

      if (this.isWrap) {
        this.$stickyBoxWrap
          .removeClass(this.options.activeClass)
          .removeAttr("style");
      }

      if (this.moveInContainer) {
        this.$container.removeClass(this.options.activeClass);
      }
    },

    recalculateOffsets: function () {
      // define box and container dimensions
      this.winParams = this.getWindowParams();

      this.data = $.extend(this.getBoxOffsets(), this.getContainerOffsets());

      this.defineExtraTop();
    },

    getBoxOffsets: function () {
      function offetTop(obj) {
        obj.top = 0;
        return obj;
      }
      var boxOffset =
        this.$stickyBox.css("position") === "fixed" ?
        offetTop(this.$stickyBox.offset()) :
        this.$stickyBox.offset();
      var boxPosition = this.$stickyBox.position();

      return {
        // sticky box offsets
        boxOffsetLeft: boxOffset.left,
        boxOffsetTop: boxOffset.top,
        // sticky box positions
        boxTopPosition: boxPosition.top,
        boxLeftPosition: boxPosition.left,
        // sticky box width/height
        boxFullHeight: this.$stickyBox.outerHeight(true),
        boxHeight: this.$stickyBox.outerHeight(),
        boxWidth: this.$stickyBox.outerWidth(),
      };
    },

    getContainerOffsets: function () {
      var containerOffset = this.moveInContainer ?
        this.$container.offset() :
        null;

      return containerOffset ? {
        // container offsets
        containerOffsetLeft: containerOffset.left,
        containerOffsetTop: containerOffset.top,
        // container height
        containerHeight: this.$container.outerHeight(),
      } : {};
    },

    getWindowParams: function () {
      return {
        height: window.innerHeight || document.documentElement.clientHeight,
      };
    },

    makeCallback: function (name) {
      if (typeof this.options[name] === "function") {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },

    destroy: function () {
      this.isInit = false;
      // remove event handlers and styles
      $win
        .off("load resize orientationchange", this.onResize)
        .off("scroll", this.onScroll);
      this.resetState();
      this.$stickyBox.removeData("StickyScrollBlock");
      if (this.isWrap) {
        this.$stickyBox.unwrap();
      }
      this.makeCallback("onDestroy");
    },
  };

  var stickyMethods = {
    fixed: {
      scrollHandler: function () {
        this.winScrollTop = $win.scrollTop();
        var isActiveSticky =
          this.winScrollTop -
          (this.options.showAfterScrolled ? this.extraTop : 0) -
          (this.options.showAfterScrolled ?
            this.data.boxHeight + this.extraTop :
            0) >
          this.data.boxOffsetTop - this.extraTop;

        if (isActiveSticky) {
          this.isStickyEnabled && this.stickyOn();
        } else {
          this.stickyOff();
        }
      },

      stickyOn: function () {
        if (!this.stickyFlag) {
          this.stickyFlag = true;
          this.parentForActive.addClass(this.options.activeClass);
          this.$stickyBox.css({
            width: this.data.boxWidth,
            position: this.options.positionType,
          });
          if (this.isWrap) {
            this.$stickyBoxWrap.css({
              height: this.data.boxFullHeight,
            });
          }
          this.makeCallback("fixedOn");
        }
        this.setDynamicPosition();
      },

      stickyOff: function () {
        if (this.stickyFlag) {
          this.stickyFlag = false;
          this.resetState();
          this.makeCallback("fixedOff");
        }
      },

      setDynamicPosition: function () {
        this.$stickyBox.css({
          top: this.getTopPosition(),
          left: this.data.boxOffsetLeft - $win.scrollLeft(),
        });
      },

      getTopPosition: function () {
        if (this.moveInContainer) {
          var currScrollTop =
            this.winScrollTop + this.data.boxHeight + this.options.extraBottom;

          return Math.min(
            this.extraTop,
            this.data.containerHeight +
            this.data.containerOffsetTop -
            currScrollTop
          );
        } else {
          return this.extraTop;
        }
      },
    },
    absolute: {
      scrollHandler: function () {
        this.winScrollTop = $win.scrollTop();
        var isActiveSticky =
          this.winScrollTop > this.data.boxOffsetTop - this.extraTop;

        if (isActiveSticky) {
          this.isStickyEnabled && this.stickyOn();
        } else {
          this.stickyOff();
        }
      },

      stickyOn: function () {
        if (!this.stickyFlag) {
          this.stickyFlag = true;
          this.parentForActive.addClass(this.options.activeClass);
          this.$stickyBox.css({
            width: this.data.boxWidth,
            transition: "transform " + this.options.animSpeed + "s ease",
            "-webkit-transition": "transform " + this.options.animSpeed + "s ease",
          });

          if (this.isWrap) {
            this.$stickyBoxWrap.css({
              height: this.data.boxFullHeight,
            });
          }

          this.makeCallback("fixedOn");
        }

        this.clearTimer();
        this.timer = setTimeout(
          function () {
            this.setDynamicPosition();
          }.bind(this),
          this.options.animDelay * 1000
        );
      },

      stickyOff: function () {
        if (this.stickyFlag) {
          this.clearTimer();
          this.stickyFlag = false;

          this.timer = setTimeout(
            function () {
              this.setDynamicPosition();
              setTimeout(
                function () {
                  this.resetState();
                }.bind(this),
                this.options.animSpeed * 1000
              );
            }.bind(this),
            this.options.animDelay * 1000
          );
          this.makeCallback("fixedOff");
        }
      },

      clearTimer: function () {
        clearTimeout(this.timer);
      },

      setDynamicPosition: function () {
        var topPosition = Math.max(0, this.getTopPosition());

        this.$stickyBox.css({
          transform: "translateY(" + topPosition + "px)",
          "-webkit-transform": "translateY(" + topPosition + "px)",
        });
      },

      getTopPosition: function () {
        var currTopPosition =
          this.winScrollTop - this.data.boxOffsetTop + this.extraTop;

        if (this.moveInContainer) {
          var currScrollTop =
            this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
          var diffOffset = Math.abs(
            Math.min(
              0,
              this.data.containerHeight +
              this.data.containerOffsetTop -
              currScrollTop -
              this.extraTop
            )
          );

          return currTopPosition - diffOffset;
        } else {
          return currTopPosition;
        }
      },
    },
  };

  // jQuery plugin interface
  $.fn.stickyScrollBlock = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    var options = $.extend({
        container: null,
        positionType: "fixed", // 'fixed' or 'absolute'
        activeClass: "fixed-position",
        setBoxHeight: true,
        showAfterScrolled: false,
        extraTop: 0,
        extraBottom: 0,
        animDelay: 0.1,
        animSpeed: 0.2,
      },
      opt
    );

    return this.each(function () {
      var $stickyBox = jQuery(this);
      var instance = $stickyBox.data("StickyScrollBlock");

      if (typeof opt === "object" || typeof opt === "undefined") {
        StickyScrollBlock.prototype = $.extend(
          stickyMethods[options.positionType],
          StickyScrollBlockPrototype
        );
        $stickyBox.data(
          "StickyScrollBlock",
          new StickyScrollBlock($stickyBox, options)
        );
      } else if (typeof method === "string" && instance) {
        if (typeof instance[method] === "function") {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };

  // module exports
  window.StickyScrollBlock = StickyScrollBlock;
})(jQuery, jQuery(window));

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/
 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues
 */
(function (i) {
  "use strict";
  "function" == typeof define && define.amd ?
    define(["jquery"], i) :
    "undefined" != typeof exports ?
    (module.exports = i(require("jquery"))) :
    i(jQuery);
})(function (i) {
  "use strict";
  var e = window.Slick || {};
  (e = (function () {
    function e(e, o) {
      var s,
        n = this;
      (n.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: i(e),
        appendDots: i(e),
        arrows: !0,
        asNavFor: null,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (e, t) {
          return i('<button type="button" />').text(t + 1);
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: 0.35,
        fade: !1,
        focusOnSelect: !1,
        focusOnChange: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3,
      }),
      (n.initials = {
        animating: !1,
        dragging: !1,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: !1,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: !1,
        slideOffset: 0,
        swipeLeft: null,
        swiping: !1,
        $list: null,
        touchObject: {},
        transformsEnabled: !1,
        unslicked: !1,
      }),
      i.extend(n, n.initials),
        (n.activeBreakpoint = null),
        (n.animType = null),
        (n.animProp = null),
        (n.breakpoints = []),
        (n.breakpointSettings = []),
        (n.cssTransitions = !1),
        (n.focussed = !1),
        (n.interrupted = !1),
        (n.hidden = "hidden"),
        (n.paused = !0),
        (n.positionProp = null),
        (n.respondTo = null),
        (n.rowCount = 1),
        (n.shouldClick = !0),
        (n.$slider = i(e)),
        (n.$slidesCache = null),
        (n.transformType = null),
        (n.transitionType = null),
        (n.visibilityChange = "visibilitychange"),
        (n.windowWidth = 0),
        (n.windowTimer = null),
        (s = i(e).data("slick") || {}),
        (n.options = i.extend({}, n.defaults, o, s)),
        (n.currentSlide = n.options.initialSlide),
        (n.originalSettings = n.options),
        "undefined" != typeof document.mozHidden ?
        ((n.hidden = "mozHidden"),
          (n.visibilityChange = "mozvisibilitychange")) :
        "undefined" != typeof document.webkitHidden &&
        ((n.hidden = "webkitHidden"),
          (n.visibilityChange = "webkitvisibilitychange")),
        (n.autoPlay = i.proxy(n.autoPlay, n)),
        (n.autoPlayClear = i.proxy(n.autoPlayClear, n)),
        (n.autoPlayIterator = i.proxy(n.autoPlayIterator, n)),
        (n.changeSlide = i.proxy(n.changeSlide, n)),
        (n.clickHandler = i.proxy(n.clickHandler, n)),
        (n.selectHandler = i.proxy(n.selectHandler, n)),
        (n.setPosition = i.proxy(n.setPosition, n)),
        (n.swipeHandler = i.proxy(n.swipeHandler, n)),
        (n.dragHandler = i.proxy(n.dragHandler, n)),
        (n.keyHandler = i.proxy(n.keyHandler, n)),
        (n.instanceUid = t++),
        (n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
        n.registerBreakpoints(),
        n.init(!0);
    }
    var t = 0;
    return e;
  })()),
  (e.prototype.activateADA = function () {
    var i = this;
    i.$slideTrack
      .find(".slick-active")
      .attr({
        "aria-hidden": "false",
      })
      .find("a, input, button, select")
      .attr({
        tabindex: "0",
      });
  }),
  (e.prototype.addSlide = e.prototype.slickAdd =
    function (e, t, o) {
      var s = this;
      if ("boolean" == typeof t)(o = t), (t = null);
      else if (t < 0 || t >= s.slideCount) return !1;
      s.unload(),
        "number" == typeof t ?
        0 === t && 0 === s.$slides.length ?
        i(e).appendTo(s.$slideTrack) :
        o ?
        i(e).insertBefore(s.$slides.eq(t)) :
        i(e).insertAfter(s.$slides.eq(t)) :
        o === !0 ?
        i(e).prependTo(s.$slideTrack) :
        i(e).appendTo(s.$slideTrack),
        (s.$slides = s.$slideTrack.children(this.options.slide)),
        s.$slideTrack.children(this.options.slide).detach(),
        s.$slideTrack.append(s.$slides),
        s.$slides.each(function (e, t) {
          i(t).attr("data-slick-index", e);
        }),
        (s.$slidesCache = s.$slides),
        s.reinit();
    }),
  (e.prototype.animateHeight = function () {
    var i = this;
    if (
      1 === i.options.slidesToShow &&
      i.options.adaptiveHeight === !0 &&
      i.options.vertical === !1
    ) {
      var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
      i.$list.animate({
          height: e,
        },
        i.options.speed
      );
    }
  }),
  (e.prototype.animateSlide = function (e, t) {
    var o = {},
      s = this;
    s.animateHeight(),
      s.options.rtl === !0 && s.options.vertical === !1 && (e = -e),
      s.transformsEnabled === !1 ?
      s.options.vertical === !1 ?
      s.$slideTrack.animate({
          left: e,
        },
        s.options.speed,
        s.options.easing,
        t
      ) :
      s.$slideTrack.animate({
          top: e,
        },
        s.options.speed,
        s.options.easing,
        t
      ) :
      s.cssTransitions === !1 ?
      (s.options.rtl === !0 && (s.currentLeft = -s.currentLeft),
        i({
          animStart: s.currentLeft,
        }).animate({
          animStart: e,
        }, {
          duration: s.options.speed,
          easing: s.options.easing,
          step: function (i) {
            (i = Math.ceil(i)),
            s.options.vertical === !1 ?
              ((o[s.animType] = "translate(" + i + "px, 0px)"),
                s.$slideTrack.css(o)) :
              ((o[s.animType] = "translate(0px," + i + "px)"),
                s.$slideTrack.css(o));
          },
          complete: function () {
            t && t.call();
          },
        })) :
      (s.applyTransition(),
        (e = Math.ceil(e)),
        s.options.vertical === !1 ?
        (o[s.animType] = "translate3d(" + e + "px, 0px, 0px)") :
        (o[s.animType] = "translate3d(0px," + e + "px, 0px)"),
        s.$slideTrack.css(o),
        t &&
        setTimeout(function () {
          s.disableTransition(), t.call();
        }, s.options.speed));
  }),
  (e.prototype.getNavTarget = function () {
    var e = this,
      t = e.options.asNavFor;
    return t && null !== t && (t = i(t).not(e.$slider)), t;
  }),
  (e.prototype.asNavFor = function (e) {
    var t = this,
      o = t.getNavTarget();
    null !== o &&
      "object" == typeof o &&
      o.each(function () {
        var t = i(this).slick("getSlick");
        t.unslicked || t.slideHandler(e, !0);
      });
  }),
  (e.prototype.applyTransition = function (i) {
    var e = this,
      t = {};
    e.options.fade === !1 ?
      (t[e.transitionType] =
        e.transformType + " " + e.options.speed + "ms " + e.options.cssEase) :
      (t[e.transitionType] =
        "opacity " + e.options.speed + "ms " + e.options.cssEase),
      e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
  }),
  (e.prototype.autoPlay = function () {
    var i = this;
    i.autoPlayClear(),
      i.slideCount > i.options.slidesToShow &&
      (i.autoPlayTimer = setInterval(
        i.autoPlayIterator,
        i.options.autoplaySpeed
      ));
  }),
  (e.prototype.autoPlayClear = function () {
    var i = this;
    i.autoPlayTimer && clearInterval(i.autoPlayTimer);
  }),
  (e.prototype.autoPlayIterator = function () {
    var i = this,
      e = i.currentSlide + i.options.slidesToScroll;
    i.paused ||
      i.interrupted ||
      i.focussed ||
      (i.options.infinite === !1 &&
        (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ?
          (i.direction = 0) :
          0 === i.direction &&
          ((e = i.currentSlide - i.options.slidesToScroll),
            i.currentSlide - 1 === 0 && (i.direction = 1))),
        i.slideHandler(e));
  }),
  (e.prototype.buildArrows = function () {
    var e = this;
    e.options.arrows === !0 &&
      ((e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow")),
        (e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow")),
        e.slideCount > e.options.slidesToShow ?
        (e.$prevArrow
          .removeClass("slick-hidden")
          .removeAttr("aria-hidden tabindex"),
          e.$nextArrow
          .removeClass("slick-hidden")
          .removeAttr("aria-hidden tabindex"),
          e.htmlExpr.test(e.options.prevArrow) &&
          e.$prevArrow.prependTo(e.options.appendArrows),
          e.htmlExpr.test(e.options.nextArrow) &&
          e.$nextArrow.appendTo(e.options.appendArrows),
          e.options.infinite !== !0 &&
          e.$prevArrow
          .addClass("slick-disabled")
          .attr("aria-disabled", "true")) :
        e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
          "aria-disabled": "true",
          tabindex: "-1",
        }));
  }),
  (e.prototype.buildDots = function () {
    var e,
      t,
      o = this;
    if (o.options.dots === !0 && o.slideCount > o.options.slidesToShow) {
      for (
        o.$slider.addClass("slick-dotted"),
        t = i("<ul />").addClass(o.options.dotsClass),
        e = 0; e <= o.getDotCount(); e += 1
      )
        t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
      (o.$dots = t.appendTo(o.options.appendDots)),
      o.$dots.find("li").first().addClass("slick-active");
    }
  }),
  (e.prototype.buildOut = function () {
    var e = this;
    (e.$slides = e.$slider
      .children(e.options.slide + ":not(.slick-cloned)")
      .addClass("slick-slide")),
    (e.slideCount = e.$slides.length),
    e.$slides.each(function (e, t) {
        i(t)
          .attr("data-slick-index", e)
          .data("originalStyling", i(t).attr("style") || "");
      }),
      e.$slider.addClass("slick-slider"),
      (e.$slideTrack =
        0 === e.slideCount ?
        i('<div class="slick-track"/>').appendTo(e.$slider) :
        e.$slides.wrapAll('<div class="slick-track"/>').parent()),
      (e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent()),
      e.$slideTrack.css("opacity", 0),
      (e.options.centerMode !== !0 && e.options.swipeToSlide !== !0) ||
      (e.options.slidesToScroll = 1),
      i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
      e.setupInfinite(),
      e.buildArrows(),
      e.buildDots(),
      e.updateDots(),
      e.setSlideClasses(
        "number" == typeof e.currentSlide ? e.currentSlide : 0
      ),
      e.options.draggable === !0 && e.$list.addClass("draggable");
  }),
  (e.prototype.buildRows = function () {
    var i,
      e,
      t,
      o,
      s,
      n,
      r,
      l = this;
    if (
      ((o = document.createDocumentFragment()),
        (n = l.$slider.children()),
        l.options.rows > 0)
    ) {
      for (
        r = l.options.slidesPerRow * l.options.rows,
        s = Math.ceil(n.length / r),
        i = 0; i < s; i++
      ) {
        var d = document.createElement("div");
        for (e = 0; e < l.options.rows; e++) {
          var a = document.createElement("div");
          for (t = 0; t < l.options.slidesPerRow; t++) {
            var c = i * r + (e * l.options.slidesPerRow + t);
            n.get(c) && a.appendChild(n.get(c));
          }
          d.appendChild(a);
        }
        o.appendChild(d);
      }
      l.$slider.empty().append(o),
        l.$slider
        .children()
        .children()
        .children()
        .css({
          width: 100 / l.options.slidesPerRow + "%",
          display: "inline-block",
        });
    }
  }),
  (e.prototype.checkResponsive = function (e, t) {
    var o,
      s,
      n,
      r = this,
      l = !1,
      d = r.$slider.width(),
      a = window.innerWidth || i(window).width();
    if (
      ("window" === r.respondTo ?
        (n = a) :
        "slider" === r.respondTo ?
        (n = d) :
        "min" === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive &&
        r.options.responsive.length &&
        null !== r.options.responsive)
    ) {
      s = null;
      for (o in r.breakpoints)
        r.breakpoints.hasOwnProperty(o) &&
        (r.originalSettings.mobileFirst === !1 ?
          n < r.breakpoints[o] && (s = r.breakpoints[o]) :
          n > r.breakpoints[o] && (s = r.breakpoints[o]));
      null !== s ?
        null !== r.activeBreakpoint ?
        (s !== r.activeBreakpoint || t) &&
        ((r.activeBreakpoint = s),
          "unslick" === r.breakpointSettings[s] ?
          r.unslick(s) :
          ((r.options = i.extend({},
              r.originalSettings,
              r.breakpointSettings[s]
            )),
            e === !0 && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
          (l = s)) :
        ((r.activeBreakpoint = s),
          "unslick" === r.breakpointSettings[s] ?
          r.unslick(s) :
          ((r.options = i.extend({},
              r.originalSettings,
              r.breakpointSettings[s]
            )),
            e === !0 && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
          (l = s)) :
        null !== r.activeBreakpoint &&
        ((r.activeBreakpoint = null),
          (r.options = r.originalSettings),
          e === !0 && (r.currentSlide = r.options.initialSlide),
          r.refresh(e),
          (l = s)),
        e || l === !1 || r.$slider.trigger("breakpoint", [r, l]);
    }
  }),
  (e.prototype.changeSlide = function (e, t) {
    var o,
      s,
      n,
      r = this,
      l = i(e.currentTarget);
    switch (
      (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        (n = r.slideCount % r.options.slidesToScroll !== 0),
        (o = n ?
          0 :
          (r.slideCount - r.currentSlide) % r.options.slidesToScroll),
        e.data.message)
    ) {
      case "previous":
        (s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o),
        r.slideCount > r.options.slidesToShow &&
          r.slideHandler(r.currentSlide - s, !1, t);
        break;
      case "next":
        (s = 0 === o ? r.options.slidesToScroll : o),
        r.slideCount > r.options.slidesToShow &&
          r.slideHandler(r.currentSlide + s, !1, t);
        break;
      case "index":
        var d =
          0 === e.data.index ?
          0 :
          e.data.index || l.index() * r.options.slidesToScroll;
        r.slideHandler(r.checkNavigable(d), !1, t),
          l.children().trigger("focus");
        break;
      default:
        return;
    }
  }),
  (e.prototype.checkNavigable = function (i) {
    var e,
      t,
      o = this;
    if (((e = o.getNavigableIndexes()), (t = 0), i > e[e.length - 1]))
      i = e[e.length - 1];
    else
      for (var s in e) {
        if (i < e[s]) {
          i = t;
          break;
        }
        t = e[s];
      }
    return i;
  }),
  (e.prototype.cleanUpEvents = function () {
    var e = this;
    e.options.dots &&
      null !== e.$dots &&
      (i("li", e.$dots)
        .off("click.slick", e.changeSlide)
        .off("mouseenter.slick", i.proxy(e.interrupt, e, !0))
        .off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        e.options.accessibility === !0 &&
        e.$dots.off("keydown.slick", e.keyHandler)),
      e.$slider.off("focus.slick blur.slick"),
      e.options.arrows === !0 &&
      e.slideCount > e.options.slidesToShow &&
      (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
        e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
        e.options.accessibility === !0 &&
        (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
          e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
      e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
      e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
      e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
      e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
      e.$list.off("click.slick", e.clickHandler),
      i(document).off(e.visibilityChange, e.visibility),
      e.cleanUpSlideEvents(),
      e.options.accessibility === !0 &&
      e.$list.off("keydown.slick", e.keyHandler),
      e.options.focusOnSelect === !0 &&
      i(e.$slideTrack).children().off("click.slick", e.selectHandler),
      i(window).off(
        "orientationchange.slick.slick-" + e.instanceUid,
        e.orientationChange
      ),
      i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
      i("[draggable!=true]", e.$slideTrack).off(
        "dragstart",
        e.preventDefault
      ),
      i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
  }),
  (e.prototype.cleanUpSlideEvents = function () {
    var e = this;
    e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
      e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
  }),
  (e.prototype.cleanUpRows = function () {
    var i,
      e = this;
    e.options.rows > 0 &&
      ((i = e.$slides.children().children()),
        i.removeAttr("style"),
        e.$slider.empty().append(i));
  }),
  (e.prototype.clickHandler = function (i) {
    var e = this;
    e.shouldClick === !1 &&
      (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
  }),
  (e.prototype.destroy = function (e) {
    var t = this;
    t.autoPlayClear(),
      (t.touchObject = {}),
      t.cleanUpEvents(),
      i(".slick-cloned", t.$slider).detach(),
      t.$dots && t.$dots.remove(),
      t.$prevArrow &&
      t.$prevArrow.length &&
      (t.$prevArrow
        .removeClass("slick-disabled slick-arrow slick-hidden")
        .removeAttr("aria-hidden aria-disabled tabindex")
        .css("display", ""),
        t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
      t.$nextArrow &&
      t.$nextArrow.length &&
      (t.$nextArrow
        .removeClass("slick-disabled slick-arrow slick-hidden")
        .removeAttr("aria-hidden aria-disabled tabindex")
        .css("display", ""),
        t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
      t.$slides &&
      (t.$slides
        .removeClass(
          "slick-slide slick-active slick-center slick-visible slick-current"
        )
        .removeAttr("aria-hidden")
        .removeAttr("data-slick-index")
        .each(function () {
          i(this).attr("style", i(this).data("originalStyling"));
        }),
        t.$slideTrack.children(this.options.slide).detach(),
        t.$slideTrack.detach(),
        t.$list.detach(),
        t.$slider.append(t.$slides)),
      t.cleanUpRows(),
      t.$slider.removeClass("slick-slider"),
      t.$slider.removeClass("slick-initialized"),
      t.$slider.removeClass("slick-dotted"),
      (t.unslicked = !0),
      e || t.$slider.trigger("destroy", [t]);
  }),
  (e.prototype.disableTransition = function (i) {
    var e = this,
      t = {};
    (t[e.transitionType] = ""),
    e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
  }),
  (e.prototype.fadeSlide = function (i, e) {
    var t = this;
    t.cssTransitions === !1 ?
      (t.$slides.eq(i).css({
          zIndex: t.options.zIndex,
        }),
        t.$slides.eq(i).animate({
            opacity: 1,
          },
          t.options.speed,
          t.options.easing,
          e
        )) :
      (t.applyTransition(i),
        t.$slides.eq(i).css({
          opacity: 1,
          zIndex: t.options.zIndex,
        }),
        e &&
        setTimeout(function () {
          t.disableTransition(i), e.call();
        }, t.options.speed));
  }),
  (e.prototype.fadeSlideOut = function (i) {
    var e = this;
    e.cssTransitions === !1 ?
      e.$slides.eq(i).animate({
          opacity: 0,
          zIndex: e.options.zIndex - 2,
        },
        e.options.speed,
        e.options.easing
      ) :
      (e.applyTransition(i),
        e.$slides.eq(i).css({
          opacity: 0,
          zIndex: e.options.zIndex - 2,
        }));
  }),
  (e.prototype.filterSlides = e.prototype.slickFilter =
    function (i) {
      var e = this;
      null !== i &&
        ((e.$slidesCache = e.$slides),
          e.unload(),
          e.$slideTrack.children(this.options.slide).detach(),
          e.$slidesCache.filter(i).appendTo(e.$slideTrack),
          e.reinit());
    }),
  (e.prototype.focusHandler = function () {
    var e = this;
    e.$slider
      .off("focus.slick blur.slick")
      .on("focus.slick", "*", function (t) {
        var o = i(this);
        setTimeout(function () {
          e.options.pauseOnFocus &&
            o.is(":focus") &&
            ((e.focussed = !0), e.autoPlay());
        }, 0);
      })
      .on("blur.slick", "*", function (t) {
        i(this);
        e.options.pauseOnFocus && ((e.focussed = !1), e.autoPlay());
      });
  }),
  (e.prototype.getCurrent = e.prototype.slickCurrentSlide =
    function () {
      var i = this;
      return i.currentSlide;
    }),
  (e.prototype.getDotCount = function () {
    var i = this,
      e = 0,
      t = 0,
      o = 0;
    if (i.options.infinite === !0)
      if (i.slideCount <= i.options.slidesToShow) ++o;
      else
        for (; e < i.slideCount;)
          ++o,
          (e = t + i.options.slidesToScroll),
          (t +=
            i.options.slidesToScroll <= i.options.slidesToShow ?
            i.options.slidesToScroll :
            i.options.slidesToShow);
    else if (i.options.centerMode === !0) o = i.slideCount;
    else if (i.options.asNavFor)
      for (; e < i.slideCount;)
        ++o,
        (e = t + i.options.slidesToScroll),
        (t +=
          i.options.slidesToScroll <= i.options.slidesToShow ?
          i.options.slidesToScroll :
          i.options.slidesToShow);
    else
      o =
      1 +
      Math.ceil(
        (i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll
      );
    return o - 1;
  }),
  (e.prototype.getLeft = function (i) {
    var e,
      t,
      o,
      s,
      n = this,
      r = 0;
    return (
      (n.slideOffset = 0),
      (t = n.$slides.first().outerHeight(!0)),
      n.options.infinite === !0 ?
      (n.slideCount > n.options.slidesToShow &&
        ((n.slideOffset = n.slideWidth * n.options.slidesToShow * -1),
          (s = -1),
          n.options.vertical === !0 &&
          n.options.centerMode === !0 &&
          (2 === n.options.slidesToShow ?
            (s = -1.5) :
            1 === n.options.slidesToShow && (s = -2)),
          (r = t * n.options.slidesToShow * s)),
        n.slideCount % n.options.slidesToScroll !== 0 &&
        i + n.options.slidesToScroll > n.slideCount &&
        n.slideCount > n.options.slidesToShow &&
        (i > n.slideCount ?
          ((n.slideOffset =
              (n.options.slidesToShow - (i - n.slideCount)) *
              n.slideWidth *
              -1),
            (r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1)) :
          ((n.slideOffset =
              (n.slideCount % n.options.slidesToScroll) *
              n.slideWidth *
              -1),
            (r = (n.slideCount % n.options.slidesToScroll) * t * -1)))) :
      i + n.options.slidesToShow > n.slideCount &&
      ((n.slideOffset =
          (i + n.options.slidesToShow - n.slideCount) * n.slideWidth),
        (r = (i + n.options.slidesToShow - n.slideCount) * t)),
      n.slideCount <= n.options.slidesToShow &&
      ((n.slideOffset = 0), (r = 0)),
      n.options.centerMode === !0 && n.slideCount <= n.options.slidesToShow ?
      (n.slideOffset =
        (n.slideWidth * Math.floor(n.options.slidesToShow)) / 2 -
        (n.slideWidth * n.slideCount) / 2) :
      n.options.centerMode === !0 && n.options.infinite === !0 ?
      (n.slideOffset +=
        n.slideWidth * Math.floor(n.options.slidesToShow / 2) -
        n.slideWidth) :
      n.options.centerMode === !0 &&
      ((n.slideOffset = 0),
        (n.slideOffset +=
          n.slideWidth * Math.floor(n.options.slidesToShow / 2))),
      (e =
        n.options.vertical === !1 ?
        i * n.slideWidth * -1 + n.slideOffset :
        i * t * -1 + r),
      n.options.variableWidth === !0 &&
      ((o =
          n.slideCount <= n.options.slidesToShow || n.options.infinite === !1 ?
          n.$slideTrack.children(".slick-slide").eq(i) :
          n.$slideTrack
          .children(".slick-slide")
          .eq(i + n.options.slidesToShow)),
        (e =
          n.options.rtl === !0 ?
          o[0] ?
          (n.$slideTrack.width() - o[0].offsetLeft - o.width()) * -1 :
          0 :
          o[0] ?
          o[0].offsetLeft * -1 :
          0),
        n.options.centerMode === !0 &&
        ((o =
            n.slideCount <= n.options.slidesToShow ||
            n.options.infinite === !1 ?
            n.$slideTrack.children(".slick-slide").eq(i) :
            n.$slideTrack
            .children(".slick-slide")
            .eq(i + n.options.slidesToShow + 1)),
          (e =
            n.options.rtl === !0 ?
            o[0] ?
            (n.$slideTrack.width() - o[0].offsetLeft - o.width()) * -1 :
            0 :
            o[0] ?
            o[0].offsetLeft * -1 :
            0),
          (e += (n.$list.width() - o.outerWidth()) / 2))),
      e
    );
  }),
  (e.prototype.getOption = e.prototype.slickGetOption =
    function (i) {
      var e = this;
      return e.options[i];
    }),
  (e.prototype.getNavigableIndexes = function () {
    var i,
      e = this,
      t = 0,
      o = 0,
      s = [];
    for (
      e.options.infinite === !1 ?
      (i = e.slideCount) :
      ((t = e.options.slidesToScroll * -1),
        (o = e.options.slidesToScroll * -1),
        (i = 2 * e.slideCount)); t < i;

    )
      s.push(t),
      (t = o + e.options.slidesToScroll),
      (o +=
        e.options.slidesToScroll <= e.options.slidesToShow ?
        e.options.slidesToScroll :
        e.options.slidesToShow);
    return s;
  }),
  (e.prototype.getSlick = function () {
    return this;
  }),
  (e.prototype.getSlideCount = function () {
    var e,
      t,
      o,
      s,
      n = this;
    return (
      (s = n.options.centerMode === !0 ? Math.floor(n.$list.width() / 2) : 0),
      (o = n.swipeLeft * -1 + s),
      n.options.swipeToSlide === !0 ?
      (n.$slideTrack.find(".slick-slide").each(function (e, s) {
          var r, l, d;
          if (
            ((r = i(s).outerWidth()),
              (l = s.offsetLeft),
              n.options.centerMode !== !0 && (l += r / 2),
              (d = l + r),
              o < d)
          )
            return (t = s), !1;
        }),
        (e = Math.abs(i(t).attr("data-slick-index") - n.currentSlide) || 1)) :
      n.options.slidesToScroll
    );
  }),
  (e.prototype.goTo = e.prototype.slickGoTo =
    function (i, e) {
      var t = this;
      t.changeSlide({
          data: {
            message: "index",
            index: parseInt(i),
          },
        },
        e
      );
    }),
  (e.prototype.init = function (e) {
    var t = this;
    i(t.$slider).hasClass("slick-initialized") ||
      (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
      e && t.$slider.trigger("init", [t]),
      t.options.accessibility === !0 && t.initADA(),
      t.options.autoplay && ((t.paused = !1), t.autoPlay());
  }),
  (e.prototype.initADA = function () {
    var e = this,
      t = Math.ceil(e.slideCount / e.options.slidesToShow),
      o = e.getNavigableIndexes().filter(function (i) {
        return i >= 0 && i < e.slideCount;
      });
    e.$slides
      .add(e.$slideTrack.find(".slick-cloned"))
      .attr({
        "aria-hidden": "true",
        tabindex: "-1",
      })
      .find("a, input, button, select")
      .attr({
        tabindex: "-1",
      }),
      null !== e.$dots &&
      (e.$slides
        .not(e.$slideTrack.find(".slick-cloned"))
        .each(function (t) {
          var s = o.indexOf(t);
          if (
            (i(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + t,
                tabindex: -1,
              }),
              s !== -1)
          ) {
            var n = "slick-slide-control" + e.instanceUid + s;
            i("#" + n).length &&
              i(this).attr({
                "aria-describedby": n,
              });
          }
        }),
        e.$dots
        .attr("role", "tablist")
        .find("li")
        .each(function (s) {
          var n = o[s];
          i(this).attr({
              role: "presentation",
            }),
            i(this)
            .find("button")
            .first()
            .attr({
              role: "tab",
              id: "slick-slide-control" + e.instanceUid + s,
              "aria-controls": "slick-slide" + e.instanceUid + n,
              "aria-label": s + 1 + " of " + t,
              "aria-selected": null,
              tabindex: "-1",
            });
        })
        .eq(e.currentSlide)
        .find("button")
        .attr({
          "aria-selected": "true",
          tabindex: "0",
        })
        .end());
    for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
      e.options.focusOnChange ?
      e.$slides.eq(s).attr({
        tabindex: "0",
      }) :
      e.$slides.eq(s).removeAttr("tabindex");
    e.activateADA();
  }),
  (e.prototype.initArrowEvents = function () {
    var i = this;
    i.options.arrows === !0 &&
      i.slideCount > i.options.slidesToShow &&
      (i.$prevArrow.off("click.slick").on(
          "click.slick", {
            message: "previous",
          },
          i.changeSlide
        ),
        i.$nextArrow.off("click.slick").on(
          "click.slick", {
            message: "next",
          },
          i.changeSlide
        ),
        i.options.accessibility === !0 &&
        (i.$prevArrow.on("keydown.slick", i.keyHandler),
          i.$nextArrow.on("keydown.slick", i.keyHandler)));
  }),
  (e.prototype.initDotEvents = function () {
    var e = this;
    e.options.dots === !0 &&
      e.slideCount > e.options.slidesToShow &&
      (i("li", e.$dots).on(
          "click.slick", {
            message: "index",
          },
          e.changeSlide
        ),
        e.options.accessibility === !0 &&
        e.$dots.on("keydown.slick", e.keyHandler)),
      e.options.dots === !0 &&
      e.options.pauseOnDotsHover === !0 &&
      e.slideCount > e.options.slidesToShow &&
      i("li", e.$dots)
      .on("mouseenter.slick", i.proxy(e.interrupt, e, !0))
      .on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
  }),
  (e.prototype.initSlideEvents = function () {
    var e = this;
    e.options.pauseOnHover &&
      (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
  }),
  (e.prototype.initializeEvents = function () {
    var e = this;
    e.initArrowEvents(),
      e.initDotEvents(),
      e.initSlideEvents(),
      e.$list.on(
        "touchstart.slick mousedown.slick", {
          action: "start",
        },
        e.swipeHandler
      ),
      e.$list.on(
        "touchmove.slick mousemove.slick", {
          action: "move",
        },
        e.swipeHandler
      ),
      e.$list.on(
        "touchend.slick mouseup.slick", {
          action: "end",
        },
        e.swipeHandler
      ),
      e.$list.on(
        "touchcancel.slick mouseleave.slick", {
          action: "end",
        },
        e.swipeHandler
      ),
      e.$list.on("click.slick", e.clickHandler),
      i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
      e.options.accessibility === !0 &&
      e.$list.on("keydown.slick", e.keyHandler),
      e.options.focusOnSelect === !0 &&
      i(e.$slideTrack).children().on("click.slick", e.selectHandler),
      i(window).on(
        "orientationchange.slick.slick-" + e.instanceUid,
        i.proxy(e.orientationChange, e)
      ),
      i(window).on(
        "resize.slick.slick-" + e.instanceUid,
        i.proxy(e.resize, e)
      ),
      i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
      i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
      i(e.setPosition);
  }),
  (e.prototype.initUI = function () {
    var i = this;
    i.options.arrows === !0 &&
      i.slideCount > i.options.slidesToShow &&
      (i.$prevArrow.show(), i.$nextArrow.show()),
      i.options.dots === !0 &&
      i.slideCount > i.options.slidesToShow &&
      i.$dots.show();
  }),
  (e.prototype.keyHandler = function (i) {
    var e = this;
    i.target.tagName.match("TEXTAREA|INPUT|SELECT") ||
      (37 === i.keyCode && e.options.accessibility === !0 ?
        e.changeSlide({
          data: {
            message: e.options.rtl === !0 ? "next" : "previous",
          },
        }) :
        39 === i.keyCode &&
        e.options.accessibility === !0 &&
        e.changeSlide({
          data: {
            message: e.options.rtl === !0 ? "previous" : "next",
          },
        }));
  }),
  (e.prototype.lazyLoad = function () {
    function e(e) {
      i("img[data-lazy]", e).each(function () {
        var e = i(this),
          t = i(this).attr("data-lazy"),
          o = i(this).attr("data-srcset"),
          s = i(this).attr("data-sizes") || r.$slider.attr("data-sizes"),
          n = document.createElement("img");
        (n.onload = function () {
          e.animate({
              opacity: 0,
            },
            100,
            function () {
              o && (e.attr("srcset", o), s && e.attr("sizes", s)),
                e.attr("src", t).animate({
                    opacity: 1,
                  },
                  200,
                  function () {
                    e.removeAttr(
                      "data-lazy data-srcset data-sizes"
                    ).removeClass("slick-loading");
                  }
                ),
                r.$slider.trigger("lazyLoaded", [r, e, t]);
            }
          );
        }),
        (n.onerror = function () {
          e
            .removeAttr("data-lazy")
            .removeClass("slick-loading")
            .addClass("slick-lazyload-error"),
            r.$slider.trigger("lazyLoadError", [r, e, t]);
        }),
        (n.src = t);
      });
    }
    var t,
      o,
      s,
      n,
      r = this;
    if (
      (r.options.centerMode === !0 ?
        r.options.infinite === !0 ?
        ((s = r.currentSlide + (r.options.slidesToShow / 2 + 1)),
          (n = s + r.options.slidesToShow + 2)) :
        ((s = Math.max(
            0,
            r.currentSlide - (r.options.slidesToShow / 2 + 1)
          )),
          (n = 2 + (r.options.slidesToShow / 2 + 1) + r.currentSlide)) :
        ((s = r.options.infinite ?
            r.options.slidesToShow + r.currentSlide :
            r.currentSlide),
          (n = Math.ceil(s + r.options.slidesToShow)),
          r.options.fade === !0 && (s > 0 && s--, n <= r.slideCount && n++)),
        (t = r.$slider.find(".slick-slide").slice(s, n)),
        "anticipated" === r.options.lazyLoad)
    )
      for (
        var l = s - 1, d = n, a = r.$slider.find(".slick-slide"), c = 0; c < r.options.slidesToScroll; c++
      )
        l < 0 && (l = r.slideCount - 1),
        (t = t.add(a.eq(l))),
        (t = t.add(a.eq(d))),
        l--,
        d++;
    e(t),
      r.slideCount <= r.options.slidesToShow ?
      ((o = r.$slider.find(".slick-slide")), e(o)) :
      r.currentSlide >= r.slideCount - r.options.slidesToShow ?
      ((o = r.$slider
          .find(".slick-cloned")
          .slice(0, r.options.slidesToShow)),
        e(o)) :
      0 === r.currentSlide &&
      ((o = r.$slider
          .find(".slick-cloned")
          .slice(r.options.slidesToShow * -1)),
        e(o));
  }),
  (e.prototype.loadSlider = function () {
    var i = this;
    i.setPosition(),
      i.$slideTrack.css({
        opacity: 1,
      }),
      i.$slider.removeClass("slick-loading"),
      i.initUI(),
      "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
  }),
  (e.prototype.next = e.prototype.slickNext =
    function () {
      var i = this;
      i.changeSlide({
        data: {
          message: "next",
        },
      });
    }),
  (e.prototype.orientationChange = function () {
    var i = this;
    i.checkResponsive(), i.setPosition();
  }),
  (e.prototype.pause = e.prototype.slickPause =
    function () {
      var i = this;
      i.autoPlayClear(), (i.paused = !0);
    }),
  (e.prototype.play = e.prototype.slickPlay =
    function () {
      var i = this;
      i.autoPlay(),
        (i.options.autoplay = !0),
        (i.paused = !1),
        (i.focussed = !1),
        (i.interrupted = !1);
    }),
  (e.prototype.postSlide = function (e) {
    var t = this;
    if (
      !t.unslicked &&
      (t.$slider.trigger("afterChange", [t, e]),
        (t.animating = !1),
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        (t.swipeLeft = null),
        t.options.autoplay && t.autoPlay(),
        t.options.accessibility === !0 &&
        (t.initADA(), t.options.focusOnChange))
    ) {
      var o = i(t.$slides.get(t.currentSlide));
      o.attr("tabindex", 0).focus();
    }
  }),
  (e.prototype.prev = e.prototype.slickPrev =
    function () {
      var i = this;
      i.changeSlide({
        data: {
          message: "previous",
        },
      });
    }),
  (e.prototype.preventDefault = function (i) {
    i.preventDefault();
  }),
  (e.prototype.progressiveLazyLoad = function (e) {
    e = e || 1;
    var t,
      o,
      s,
      n,
      r,
      l = this,
      d = i("img[data-lazy]", l.$slider);
    d.length ?
      ((t = d.first()),
        (o = t.attr("data-lazy")),
        (s = t.attr("data-srcset")),
        (n = t.attr("data-sizes") || l.$slider.attr("data-sizes")),
        (r = document.createElement("img")),
        (r.onload = function () {
          s && (t.attr("srcset", s), n && t.attr("sizes", n)),
            t
            .attr("src", o)
            .removeAttr("data-lazy data-srcset data-sizes")
            .removeClass("slick-loading"),
            l.options.adaptiveHeight === !0 && l.setPosition(),
            l.$slider.trigger("lazyLoaded", [l, t, o]),
            l.progressiveLazyLoad();
        }),
        (r.onerror = function () {
          e < 3 ?
            setTimeout(function () {
              l.progressiveLazyLoad(e + 1);
            }, 500) :
            (t
              .removeAttr("data-lazy")
              .removeClass("slick-loading")
              .addClass("slick-lazyload-error"),
              l.$slider.trigger("lazyLoadError", [l, t, o]),
              l.progressiveLazyLoad());
        }),
        (r.src = o)) :
      l.$slider.trigger("allImagesLoaded", [l]);
  }),
  (e.prototype.refresh = function (e) {
    var t,
      o,
      s = this;
    (o = s.slideCount - s.options.slidesToShow),
    !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
      s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
      (t = s.currentSlide),
      s.destroy(!0),
      i.extend(s, s.initials, {
        currentSlide: t,
      }),
      s.init(),
      e ||
      s.changeSlide({
          data: {
            message: "index",
            index: t,
          },
        },
        !1
      );
  }),
  (e.prototype.registerBreakpoints = function () {
    var e,
      t,
      o,
      s = this,
      n = s.options.responsive || null;
    if ("array" === i.type(n) && n.length) {
      s.respondTo = s.options.respondTo || "window";
      for (e in n)
        if (((o = s.breakpoints.length - 1), n.hasOwnProperty(e))) {
          for (t = n[e].breakpoint; o >= 0;)
            s.breakpoints[o] &&
            s.breakpoints[o] === t &&
            s.breakpoints.splice(o, 1),
            o--;
          s.breakpoints.push(t), (s.breakpointSettings[t] = n[e].settings);
        }
      s.breakpoints.sort(function (i, e) {
        return s.options.mobileFirst ? i - e : e - i;
      });
    }
  }),
  (e.prototype.reinit = function () {
    var e = this;
    (e.$slides = e.$slideTrack
      .children(e.options.slide)
      .addClass("slick-slide")),
    (e.slideCount = e.$slides.length),
    e.currentSlide >= e.slideCount &&
      0 !== e.currentSlide &&
      (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
      e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
      e.registerBreakpoints(),
      e.setProps(),
      e.setupInfinite(),
      e.buildArrows(),
      e.updateArrows(),
      e.initArrowEvents(),
      e.buildDots(),
      e.updateDots(),
      e.initDotEvents(),
      e.cleanUpSlideEvents(),
      e.initSlideEvents(),
      e.checkResponsive(!1, !0),
      e.options.focusOnSelect === !0 &&
      i(e.$slideTrack).children().on("click.slick", e.selectHandler),
      e.setSlideClasses(
        "number" == typeof e.currentSlide ? e.currentSlide : 0
      ),
      e.setPosition(),
      e.focusHandler(),
      (e.paused = !e.options.autoplay),
      e.autoPlay(),
      e.$slider.trigger("reInit", [e]);
  }),
  (e.prototype.resize = function () {
    var e = this;
    i(window).width() !== e.windowWidth &&
      (clearTimeout(e.windowDelay),
        (e.windowDelay = window.setTimeout(function () {
          (e.windowWidth = i(window).width()),
          e.checkResponsive(),
            e.unslicked || e.setPosition();
        }, 50)));
  }),
  (e.prototype.removeSlide = e.prototype.slickRemove =
    function (i, e, t) {
      var o = this;
      return (
        "boolean" == typeof i ?
        ((e = i), (i = e === !0 ? 0 : o.slideCount - 1)) :
        (i = e === !0 ? --i : i),
        !(o.slideCount < 1 || i < 0 || i > o.slideCount - 1) &&
        (o.unload(),
          t === !0 ?
          o.$slideTrack.children().remove() :
          o.$slideTrack.children(this.options.slide).eq(i).remove(),
          (o.$slides = o.$slideTrack.children(this.options.slide)),
          o.$slideTrack.children(this.options.slide).detach(),
          o.$slideTrack.append(o.$slides),
          (o.$slidesCache = o.$slides),
          void o.reinit())
      );
    }),
  (e.prototype.setCSS = function (i) {
    var e,
      t,
      o = this,
      s = {};
    o.options.rtl === !0 && (i = -i),
      (e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
      (t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px"),
      (s[o.positionProp] = i),
      o.transformsEnabled === !1 ?
      o.$slideTrack.css(s) :
      ((s = {}),
        o.cssTransitions === !1 ?
        ((s[o.animType] = "translate(" + e + ", " + t + ")"),
          o.$slideTrack.css(s)) :
        ((s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)"),
          o.$slideTrack.css(s)));
  }),
  (e.prototype.setDimensions = function () {
    var i = this;
    i.options.vertical === !1 ?
      i.options.centerMode === !0 &&
      i.$list.css({
        padding: "0px " + i.options.centerPadding,
      }) :
      (i.$list.height(
          i.$slides.first().outerHeight(!0) * i.options.slidesToShow
        ),
        i.options.centerMode === !0 &&
        i.$list.css({
          padding: i.options.centerPadding + " 0px",
        })),
      (i.listWidth = i.$list.width()),
      (i.listHeight = i.$list.height()),
      i.options.vertical === !1 && i.options.variableWidth === !1 ?
      ((i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow)),
        i.$slideTrack.width(
          Math.ceil(
            i.slideWidth * i.$slideTrack.children(".slick-slide").length
          )
        )) :
      i.options.variableWidth === !0 ?
      i.$slideTrack.width(5e3 * i.slideCount) :
      ((i.slideWidth = Math.ceil(i.listWidth)),
        i.$slideTrack.height(
          Math.ceil(
            i.$slides.first().outerHeight(!0) *
            i.$slideTrack.children(".slick-slide").length
          )
        ));
    var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
    i.options.variableWidth === !1 &&
      i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
  }),
  (e.prototype.setFade = function () {
    var e,
      t = this;
    t.$slides.each(function (o, s) {
        (e = t.slideWidth * o * -1),
        t.options.rtl === !0 ?
          i(s).css({
            position: "relative",
            right: e,
            top: 0,
            zIndex: t.options.zIndex - 2,
            opacity: 0,
          }) :
          i(s).css({
            position: "relative",
            left: e,
            top: 0,
            zIndex: t.options.zIndex - 2,
            opacity: 0,
          });
      }),
      t.$slides.eq(t.currentSlide).css({
        zIndex: t.options.zIndex - 1,
        opacity: 1,
      });
  }),
  (e.prototype.setHeight = function () {
    var i = this;
    if (
      1 === i.options.slidesToShow &&
      i.options.adaptiveHeight === !0 &&
      i.options.vertical === !1
    ) {
      var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
      i.$list.css("height", e);
    }
  }),
  (e.prototype.setOption = e.prototype.slickSetOption =
    function () {
      var e,
        t,
        o,
        s,
        n,
        r = this,
        l = !1;
      if (
        ("object" === i.type(arguments[0]) ?
          ((o = arguments[0]), (l = arguments[1]), (n = "multiple")) :
          "string" === i.type(arguments[0]) &&
          ((o = arguments[0]),
            (s = arguments[1]),
            (l = arguments[2]),
            "responsive" === arguments[0] && "array" === i.type(arguments[1]) ?
            (n = "responsive") :
            "undefined" != typeof arguments[1] && (n = "single")),
          "single" === n)
      )
        r.options[o] = s;
      else if ("multiple" === n)
        i.each(o, function (i, e) {
          r.options[i] = e;
        });
      else if ("responsive" === n)
        for (t in s)
          if ("array" !== i.type(r.options.responsive))
            r.options.responsive = [s[t]];
          else {
            for (e = r.options.responsive.length - 1; e >= 0;)
              r.options.responsive[e].breakpoint === s[t].breakpoint &&
              r.options.responsive.splice(e, 1),
              e--;
            r.options.responsive.push(s[t]);
          }
      l && (r.unload(), r.reinit());
    }),
  (e.prototype.setPosition = function () {
    var i = this;
    i.setDimensions(),
      i.setHeight(),
      i.options.fade === !1 ?
      i.setCSS(i.getLeft(i.currentSlide)) :
      i.setFade(),
      i.$slider.trigger("setPosition", [i]);
  }),
  (e.prototype.setProps = function () {
    var i = this,
      e = document.body.style;
    (i.positionProp = i.options.vertical === !0 ? "top" : "left"),
    "top" === i.positionProp ?
      i.$slider.addClass("slick-vertical") :
      i.$slider.removeClass("slick-vertical"),
      (void 0 === e.WebkitTransition &&
        void 0 === e.MozTransition &&
        void 0 === e.msTransition) ||
      (i.options.useCSS === !0 && (i.cssTransitions = !0)),
      i.options.fade &&
      ("number" == typeof i.options.zIndex ?
        i.options.zIndex < 3 && (i.options.zIndex = 3) :
        (i.options.zIndex = i.defaults.zIndex)),
      void 0 !== e.OTransform &&
      ((i.animType = "OTransform"),
        (i.transformType = "-o-transform"),
        (i.transitionType = "OTransition"),
        void 0 === e.perspectiveProperty &&
        void 0 === e.webkitPerspective &&
        (i.animType = !1)),
      void 0 !== e.MozTransform &&
      ((i.animType = "MozTransform"),
        (i.transformType = "-moz-transform"),
        (i.transitionType = "MozTransition"),
        void 0 === e.perspectiveProperty &&
        void 0 === e.MozPerspective &&
        (i.animType = !1)),
      void 0 !== e.webkitTransform &&
      ((i.animType = "webkitTransform"),
        (i.transformType = "-webkit-transform"),
        (i.transitionType = "webkitTransition"),
        void 0 === e.perspectiveProperty &&
        void 0 === e.webkitPerspective &&
        (i.animType = !1)),
      void 0 !== e.msTransform &&
      ((i.animType = "msTransform"),
        (i.transformType = "-ms-transform"),
        (i.transitionType = "msTransition"),
        void 0 === e.msTransform && (i.animType = !1)),
      void 0 !== e.transform &&
      i.animType !== !1 &&
      ((i.animType = "transform"),
        (i.transformType = "transform"),
        (i.transitionType = "transition")),
      (i.transformsEnabled =
        i.options.useTransform && null !== i.animType && i.animType !== !1);
  }),
  (e.prototype.setSlideClasses = function (i) {
    var e,
      t,
      o,
      s,
      n = this;
    if (
      ((t = n.$slider
          .find(".slick-slide")
          .removeClass("slick-active slick-center slick-current")
          .attr("aria-hidden", "true")),
        n.$slides.eq(i).addClass("slick-current"),
        n.options.centerMode === !0)
    ) {
      var r = n.options.slidesToShow % 2 === 0 ? 1 : 0;
      (e = Math.floor(n.options.slidesToShow / 2)),
      n.options.infinite === !0 &&
        (i >= e && i <= n.slideCount - 1 - e ?
          n.$slides
          .slice(i - e + r, i + e + 1)
          .addClass("slick-active")
          .attr("aria-hidden", "false") :
          ((o = n.options.slidesToShow + i),
            t
            .slice(o - e + 1 + r, o + e + 2)
            .addClass("slick-active")
            .attr("aria-hidden", "false")),
          0 === i ?
          t
          .eq(t.length - 1 - n.options.slidesToShow)
          .addClass("slick-center") :
          i === n.slideCount - 1 &&
          t.eq(n.options.slidesToShow).addClass("slick-center")),
        n.$slides.eq(i).addClass("slick-center");
    } else
      i >= 0 && i <= n.slideCount - n.options.slidesToShow ?
      n.$slides
      .slice(i, i + n.options.slidesToShow)
      .addClass("slick-active")
      .attr("aria-hidden", "false") :
      t.length <= n.options.slidesToShow ?
      t.addClass("slick-active").attr("aria-hidden", "false") :
      ((s = n.slideCount % n.options.slidesToShow),
        (o = n.options.infinite === !0 ? n.options.slidesToShow + i : i),
        n.options.slidesToShow == n.options.slidesToScroll &&
        n.slideCount - i < n.options.slidesToShow ?
        t
        .slice(o - (n.options.slidesToShow - s), o + s)
        .addClass("slick-active")
        .attr("aria-hidden", "false") :
        t
        .slice(o, o + n.options.slidesToShow)
        .addClass("slick-active")
        .attr("aria-hidden", "false"));
    ("ondemand" !== n.options.lazyLoad &&
      "anticipated" !== n.options.lazyLoad) ||
    n.lazyLoad();
  }),
  (e.prototype.setupInfinite = function () {
    var e,
      t,
      o,
      s = this;
    if (
      (s.options.fade === !0 && (s.options.centerMode = !1),
        s.options.infinite === !0 &&
        s.options.fade === !1 &&
        ((t = null), s.slideCount > s.options.slidesToShow))
    ) {
      for (
        o =
        s.options.centerMode === !0 ?
        s.options.slidesToShow + 1 :
        s.options.slidesToShow,
        e = s.slideCount; e > s.slideCount - o; e -= 1
      )
        (t = e - 1),
        i(s.$slides[t])
        .clone(!0)
        .attr("id", "")
        .attr("data-slick-index", t - s.slideCount)
        .prependTo(s.$slideTrack)
        .addClass("slick-cloned");
      for (e = 0; e < o + s.slideCount; e += 1)
        (t = e),
        i(s.$slides[t])
        .clone(!0)
        .attr("id", "")
        .attr("data-slick-index", t + s.slideCount)
        .appendTo(s.$slideTrack)
        .addClass("slick-cloned");
      s.$slideTrack
        .find(".slick-cloned")
        .find("[id]")
        .each(function () {
          i(this).attr("id", "");
        });
    }
  }),
  (e.prototype.interrupt = function (i) {
    var e = this;
    i || e.autoPlay(), (e.interrupted = i);
  }),
  (e.prototype.selectHandler = function (e) {
    var t = this,
      o = i(e.target).is(".slick-slide") ?
      i(e.target) :
      i(e.target).parents(".slick-slide"),
      s = parseInt(o.attr("data-slick-index"));
    return (
      s || (s = 0),
      t.slideCount <= t.options.slidesToShow ?
      void t.slideHandler(s, !1, !0) :
      void t.slideHandler(s)
    );
  }),
  (e.prototype.slideHandler = function (i, e, t) {
    var o,
      s,
      n,
      r,
      l,
      d = null,
      a = this;
    if (
      ((e = e || !1),
        !(
          (a.animating === !0 && a.options.waitForAnimate === !0) ||
          (a.options.fade === !0 && a.currentSlide === i)
        ))
    )
      return (
        e === !1 && a.asNavFor(i),
        (o = i),
        (d = a.getLeft(o)),
        (r = a.getLeft(a.currentSlide)),
        (a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft),
        a.options.infinite === !1 &&
        a.options.centerMode === !1 &&
        (i < 0 || i > a.getDotCount() * a.options.slidesToScroll) ?
        void(
          a.options.fade === !1 &&
          ((o = a.currentSlide),
            t !== !0 && a.slideCount > a.options.slidesToShow ?
            a.animateSlide(r, function () {
              a.postSlide(o);
            }) :
            a.postSlide(o))
        ) :
        a.options.infinite === !1 &&
        a.options.centerMode === !0 &&
        (i < 0 || i > a.slideCount - a.options.slidesToScroll) ?
        void(
          a.options.fade === !1 &&
          ((o = a.currentSlide),
            t !== !0 && a.slideCount > a.options.slidesToShow ?
            a.animateSlide(r, function () {
              a.postSlide(o);
            }) :
            a.postSlide(o))
        ) :
        (a.options.autoplay && clearInterval(a.autoPlayTimer),
          (s =
            o < 0 ?
            a.slideCount % a.options.slidesToScroll !== 0 ?
            a.slideCount - (a.slideCount % a.options.slidesToScroll) :
            a.slideCount + o :
            o >= a.slideCount ?
            a.slideCount % a.options.slidesToScroll !== 0 ?
            0 :
            o - a.slideCount :
            o),
          (a.animating = !0),
          a.$slider.trigger("beforeChange", [a, a.currentSlide, s]),
          (n = a.currentSlide),
          (a.currentSlide = s),
          a.setSlideClasses(a.currentSlide),
          a.options.asNavFor &&
          ((l = a.getNavTarget()),
            (l = l.slick("getSlick")),
            l.slideCount <= l.options.slidesToShow &&
            l.setSlideClasses(a.currentSlide)),
          a.updateDots(),
          a.updateArrows(),
          a.options.fade === !0 ?
          (t !== !0 ?
            (a.fadeSlideOut(n),
              a.fadeSlide(s, function () {
                a.postSlide(s);
              })) :
            a.postSlide(s),
            void a.animateHeight()) :
          void(t !== !0 && a.slideCount > a.options.slidesToShow ?
            a.animateSlide(d, function () {
              a.postSlide(s);
            }) :
            a.postSlide(s)))
      );
  }),
  (e.prototype.startLoad = function () {
    var i = this;
    i.options.arrows === !0 &&
      i.slideCount > i.options.slidesToShow &&
      (i.$prevArrow.hide(), i.$nextArrow.hide()),
      i.options.dots === !0 &&
      i.slideCount > i.options.slidesToShow &&
      i.$dots.hide(),
      i.$slider.addClass("slick-loading");
  }),
  (e.prototype.swipeDirection = function () {
    var i,
      e,
      t,
      o,
      s = this;
    return (
      (i = s.touchObject.startX - s.touchObject.curX),
      (e = s.touchObject.startY - s.touchObject.curY),
      (t = Math.atan2(e, i)),
      (o = Math.round((180 * t) / Math.PI)),
      o < 0 && (o = 360 - Math.abs(o)),
      o <= 45 && o >= 0 ?
      s.options.rtl === !1 ?
      "left" :
      "right" :
      o <= 360 && o >= 315 ?
      s.options.rtl === !1 ?
      "left" :
      "right" :
      o >= 135 && o <= 225 ?
      s.options.rtl === !1 ?
      "right" :
      "left" :
      s.options.verticalSwiping === !0 ?
      o >= 35 && o <= 135 ?
      "down" :
      "up" :
      "vertical"
    );
  }),
  (e.prototype.swipeEnd = function (i) {
    var e,
      t,
      o = this;
    if (((o.dragging = !1), (o.swiping = !1), o.scrolling))
      return (o.scrolling = !1), !1;
    if (
      ((o.interrupted = !1),
        (o.shouldClick = !(o.touchObject.swipeLength > 10)),
        void 0 === o.touchObject.curX)
    )
      return !1;
    if (
      (o.touchObject.edgeHit === !0 &&
        o.$slider.trigger("edge", [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe)
    ) {
      switch ((t = o.swipeDirection())) {
        case "left":
        case "down":
          (e = o.options.swipeToSlide ?
            o.checkNavigable(o.currentSlide + o.getSlideCount()) :
            o.currentSlide + o.getSlideCount()),
          (o.currentDirection = 0);
          break;
        case "right":
        case "up":
          (e = o.options.swipeToSlide ?
            o.checkNavigable(o.currentSlide - o.getSlideCount()) :
            o.currentSlide - o.getSlideCount()),
          (o.currentDirection = 1);
      }
      "vertical" != t &&
        (o.slideHandler(e),
          (o.touchObject = {}),
          o.$slider.trigger("swipe", [o, t]));
    } else
      o.touchObject.startX !== o.touchObject.curX &&
      (o.slideHandler(o.currentSlide), (o.touchObject = {}));
  }),
  (e.prototype.swipeHandler = function (i) {
    var e = this;
    if (
      !(
        e.options.swipe === !1 ||
        ("ontouchend" in document && e.options.swipe === !1) ||
        (e.options.draggable === !1 && i.type.indexOf("mouse") !== -1)
      )
    )
      switch (
        ((e.touchObject.fingerCount =
            i.originalEvent && void 0 !== i.originalEvent.touches ?
            i.originalEvent.touches.length :
            1),
          (e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold),
          e.options.verticalSwiping === !0 &&
          (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
          i.data.action)
      ) {
        case "start":
          e.swipeStart(i);
          break;
        case "move":
          e.swipeMove(i);
          break;
        case "end":
          e.swipeEnd(i);
      }
  }),
  (e.prototype.swipeMove = function (i) {
    var e,
      t,
      o,
      s,
      n,
      r,
      l = this;
    return (
      (n = void 0 !== i.originalEvent ? i.originalEvent.touches : null),
      !(!l.dragging || l.scrolling || (n && 1 !== n.length)) &&
      ((e = l.getLeft(l.currentSlide)),
        (l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX),
        (l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY),
        (l.touchObject.swipeLength = Math.round(
          Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))
        )),
        (r = Math.round(
          Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))
        )),
        !l.options.verticalSwiping && !l.swiping && r > 4 ?
        ((l.scrolling = !0), !1) :
        (l.options.verticalSwiping === !0 &&
          (l.touchObject.swipeLength = r),
          (t = l.swipeDirection()),
          void 0 !== i.originalEvent &&
          l.touchObject.swipeLength > 4 &&
          ((l.swiping = !0), i.preventDefault()),
          (s =
            (l.options.rtl === !1 ? 1 : -1) *
            (l.touchObject.curX > l.touchObject.startX ? 1 : -1)),
          l.options.verticalSwiping === !0 &&
          (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
          (o = l.touchObject.swipeLength),
          (l.touchObject.edgeHit = !1),
          l.options.infinite === !1 &&
          ((0 === l.currentSlide && "right" === t) ||
            (l.currentSlide >= l.getDotCount() && "left" === t)) &&
          ((o = l.touchObject.swipeLength * l.options.edgeFriction),
            (l.touchObject.edgeHit = !0)),
          l.options.vertical === !1 ?
          (l.swipeLeft = e + o * s) :
          (l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s),
          l.options.verticalSwiping === !0 && (l.swipeLeft = e + o * s),
          l.options.fade !== !0 &&
          l.options.touchMove !== !1 &&
          (l.animating === !0 ?
            ((l.swipeLeft = null), !1) :
            void l.setCSS(l.swipeLeft))))
    );
  }),
  (e.prototype.swipeStart = function (i) {
    var e,
      t = this;
    return (
      (t.interrupted = !0),
      1 !== t.touchObject.fingerCount ||
      t.slideCount <= t.options.slidesToShow ?
      ((t.touchObject = {}), !1) :
      (void 0 !== i.originalEvent &&
        void 0 !== i.originalEvent.touches &&
        (e = i.originalEvent.touches[0]),
        (t.touchObject.startX = t.touchObject.curX =
          void 0 !== e ? e.pageX : i.clientX),
        (t.touchObject.startY = t.touchObject.curY =
          void 0 !== e ? e.pageY : i.clientY),
        void(t.dragging = !0))
    );
  }),
  (e.prototype.unfilterSlides = e.prototype.slickUnfilter =
    function () {
      var i = this;
      null !== i.$slidesCache &&
        (i.unload(),
          i.$slideTrack.children(this.options.slide).detach(),
          i.$slidesCache.appendTo(i.$slideTrack),
          i.reinit());
    }),
  (e.prototype.unload = function () {
    var e = this;
    i(".slick-cloned", e.$slider).remove(),
      e.$dots && e.$dots.remove(),
      e.$prevArrow &&
      e.htmlExpr.test(e.options.prevArrow) &&
      e.$prevArrow.remove(),
      e.$nextArrow &&
      e.htmlExpr.test(e.options.nextArrow) &&
      e.$nextArrow.remove(),
      e.$slides
      .removeClass("slick-slide slick-active slick-visible slick-current")
      .attr("aria-hidden", "true")
      .css("width", "");
  }),
  (e.prototype.unslick = function (i) {
    var e = this;
    e.$slider.trigger("unslick", [e, i]), e.destroy();
  }),
  (e.prototype.updateArrows = function () {
    var i,
      e = this;
    (i = Math.floor(e.options.slidesToShow / 2)),
    e.options.arrows === !0 &&
      e.slideCount > e.options.slidesToShow &&
      !e.options.infinite &&
      (e.$prevArrow
        .removeClass("slick-disabled")
        .attr("aria-disabled", "false"),
        e.$nextArrow
        .removeClass("slick-disabled")
        .attr("aria-disabled", "false"),
        0 === e.currentSlide ?
        (e.$prevArrow
          .addClass("slick-disabled")
          .attr("aria-disabled", "true"),
          e.$nextArrow
          .removeClass("slick-disabled")
          .attr("aria-disabled", "false")) :
        e.currentSlide >= e.slideCount - e.options.slidesToShow &&
        e.options.centerMode === !1 ?
        (e.$nextArrow
          .addClass("slick-disabled")
          .attr("aria-disabled", "true"),
          e.$prevArrow
          .removeClass("slick-disabled")
          .attr("aria-disabled", "false")) :
        e.currentSlide >= e.slideCount - 1 &&
        e.options.centerMode === !0 &&
        (e.$nextArrow
          .addClass("slick-disabled")
          .attr("aria-disabled", "true"),
          e.$prevArrow
          .removeClass("slick-disabled")
          .attr("aria-disabled", "false")));
  }),
  (e.prototype.updateDots = function () {
    var i = this;
    null !== i.$dots &&
      (i.$dots.find("li").removeClass("slick-active").end(),
        i.$dots
        .find("li")
        .eq(Math.floor(i.currentSlide / i.options.slidesToScroll))
        .addClass("slick-active"));
  }),
  (e.prototype.visibility = function () {
    var i = this;
    i.options.autoplay &&
      (document[i.hidden] ? (i.interrupted = !0) : (i.interrupted = !1));
  }),
  (i.fn.slick = function () {
    var i,
      t,
      o = this,
      s = arguments[0],
      n = Array.prototype.slice.call(arguments, 1),
      r = o.length;
    for (i = 0; i < r; i++)
      if (
        ("object" == typeof s || "undefined" == typeof s ?
          (o[i].slick = new e(o[i], s)) :
          (t = o[i].slick[s].apply(o[i].slick, n)),
          "undefined" != typeof t)
      )
        return t;
    return o;
  });
});

// navigation accesibility module
function TouchNav(opt) {
  this.options = {
    hoverClass: "hover",
    menuItems: "li",
    menuOpener: "a",
    menuDrop: "ul",
    navBlock: null,
    destroy: null,
  };
  for (var p in opt) {
    if (opt.hasOwnProperty(p)) {
      this.options[p] = opt[p];
    }
  }
  // console.log(this)
  this.init();
}

TouchNav.isActiveOn = function (elem) {
  return elem && elem.touchNavActive;
};

TouchNav.prototype = {
  init: function () {
    if (typeof this.options.navBlock === "string") {
      this.menu = document.getElementById(this.options.navBlock);
    } else if (typeof this.options.navBlock === "object") {
      this.menu = this.options.navBlock;
    }
    if (this.menu) {
      this.hanldeEvents();
    }
  },
  hanldeEvents: function () {
    // attach event handlers
    var self = this;
    var touchEvent =
      (navigator.pointerEnabled && "pointerdown") ||
      (navigator.msPointerEnabled && "MSPointerDown") ||
      (this.isTouchDevice && "touchstart");
    this.menuItems = lib.queryElementsBySelector(
      this.options.menuItems,
      this.menu
    );

    var initMenuItem = function (item) {
      var currentDrop = lib.queryElementsBySelector(
          self.options.menuDrop,
          item
        )[0],
        currentOpener = lib.queryElementsBySelector(
          self.options.menuOpener,
          item
        )[0];

      // only for touch input devices
      if (
        currentDrop &&
        currentOpener &&
        (self.isTouchDevice || self.isPointerDevice)
      ) {
        if (!self.options.destroy) {
          lib.event.add(
            currentOpener,
            "click",
            lib.bind(self.clickHandler, self)
          );
          lib.event.add(
            currentOpener,
            "mousedown",
            lib.bind(self.mousedownHandler, self)
          );
          lib.event.add(currentOpener, touchEvent, function (e) {
            if (!self.isTouchPointerEvent(e)) {
              self.preventCurrentClick = false;
              return;
            }
            self.touchFlag = true;
            self.currentItem = item;
            self.currentLink = currentOpener;
            self.pressHandler.apply(self, arguments);
          });
        } else {
          lib.event.remove(currentOpener, "click");
          lib.event.remove(currentOpener, "mousedown");
          lib.event.remove(currentOpener, touchEvent);
        }
      }
      if (!self.options.destroy) {
        // for desktop computers and touch devices
        jQuery(item).bind("mouseenter", function () {
          if (!self.touchFlag) {
            self.currentItem = item;
            self.mouseoverHandler();
          }
        });
        jQuery(item).bind("mouseleave", function () {
          if (!self.touchFlag) {
            self.currentItem = item;
            self.mouseoutHandler();
          }
        });
        item.touchNavActive = true;
      } else {
        jQuery(item).unbind("mouseenter");
        jQuery(item).unbind("mouseleave");

        item.touchNavActive = false;
      }
    };

    // addd handlers for all menu items
    for (var i = 0; i < this.menuItems.length; i++) {
      initMenuItem(self.menuItems[i]);
    }

    // hide dropdowns when clicking outside navigation
    if (this.isTouchDevice || this.isPointerDevice) {
      lib.event.add(
        document.documentElement,
        "mousedown",
        lib.bind(this.clickOutsideHandler, this)
      );
      lib.event.add(
        document.documentElement,
        touchEvent,
        lib.bind(this.clickOutsideHandler, this)
      );
    }
  },
  mousedownHandler: function (e) {
    if (this.touchFlag) {
      e.preventDefault();
      this.touchFlag = false;
      this.preventCurrentClick = false;
    }
  },
  mouseoverHandler: function () {
    lib.addClass(this.currentItem, this.options.hoverClass);
    /**/
    // jQuery(this.currentItem).trigger('itemhover');
    /**/
  },
  mouseoutHandler: function () {
    lib.removeClass(this.currentItem, this.options.hoverClass);
    /**/
    // jQuery(this.currentItem).trigger('itemleave');
    /**/
  },
  hideActiveDropdown: function () {
    for (var i = 0; i < this.menuItems.length; i++) {
      if (lib.hasClass(this.menuItems[i], this.options.hoverClass)) {
        lib.removeClass(this.menuItems[i], this.options.hoverClass);
        /**/
        // jQuery(this.menuItems[i]).trigger('itemleave');
        /**/
      }
    }
    this.activeParent = null;
  },
  pressHandler: function (e) {
    // hide previous drop (if active)
    if (this.currentItem !== this.activeParent) {
      if (
        this.activeParent &&
        this.currentItem.parentNode === this.activeParent.parentNode
      ) {
        lib.removeClass(this.activeParent, this.options.hoverClass);
      } else if (!this.isParent(this.activeParent, this.currentLink)) {
        this.hideActiveDropdown();
      }
    }
    // handle current drop
    this.activeParent = this.currentItem;
    if (lib.hasClass(this.currentItem, this.options.hoverClass)) {
      this.preventCurrentClick = false;
    } else {
      e.preventDefault();
      this.preventCurrentClick = true;
      lib.addClass(this.currentItem, this.options.hoverClass);
      /**/
      // jQuery(this.currentItem).trigger('itemhover');
      /**/
    }
  },
  clickHandler: function (e) {
    // prevent first click on link
    if (this.preventCurrentClick) {
      e.preventDefault();
    }
  },
  clickOutsideHandler: function (event) {
    var e = event.changedTouches ? event.changedTouches[0] : event;
    if (this.activeParent && !this.isParent(this.menu, e.target)) {
      this.hideActiveDropdown();
      this.touchFlag = false;
    }
  },
  isParent: function (parent, child) {
    while (child.parentNode) {
      if (child.parentNode == parent) {
        return true;
      }
      child = child.parentNode;
    }
    return false;
  },

  isTouchPointerEvent: function (e) {
    return (
      e.type.indexOf("touch") > -1 ||
      (navigator.pointerEnabled && e.pointerType === "touch") ||
      (navigator.msPointerEnabled && e.pointerType == e.MSPOINTER_TYPE_TOUCH)
    );
  },
  isPointerDevice: (function () {
    return !!(navigator.pointerEnabled || navigator.msPointerEnabled);
  })(),
  isTouchDevice: (function () {
    return !!(
      "ontouchstart" in window ||
      (window.DocumentTouch && document instanceof DocumentTouch)
    );
  })(),
};

/*
 * Utility module
 */
lib = {
  hasClass: function (el, cls) {
    return el && el.className ?
      el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)")) :
      false;
  },
  addClass: function (el, cls) {
    if (el && !this.hasClass(el, cls)) el.className += " " + cls;
  },
  removeClass: function (el, cls) {
    if (el && this.hasClass(el, cls)) {
      el.className = el.className.replace(
        new RegExp("(\\s|^)" + cls + "(\\s|$)"),
        " "
      );
    }
  },
  extend: function (obj) {
    for (var i = 1; i < arguments.length; i++) {
      for (var p in arguments[i]) {
        if (arguments[i].hasOwnProperty(p)) {
          obj[p] = arguments[i][p];
        }
      }
    }
    return obj;
  },
  each: function (obj, callback) {
    var property, len;
    if (typeof obj.length === "number") {
      for (property = 0, len = obj.length; property < len; property++) {
        if (callback.call(obj[property], property, obj[property]) === false) {
          break;
        }
      }
    } else {
      for (property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (callback.call(obj[property], property, obj[property]) === false) {
            break;
          }
        }
      }
    }
  },
  event: (function () {
    var fixEvent = function (e) {
      e = e || window.event;
      if (e.isFixed) return e;
      else e.isFixed = true;
      if (!e.target) e.target = e.srcElement;
      e.preventDefault =
        e.preventDefault ||
        function () {
          this.returnValue = false;
        };
      e.stopPropagation =
        e.stopPropagation ||
        function () {
          this.cancelBubble = true;
        };
      return e;
    };
    return {
      add: function (elem, event, handler) {
        if (!elem.events) {
          elem.events = {};
          elem.handle = function (e) {
            var ret,
              handlers = elem.events[e.type];
            e = fixEvent(e);
            for (var i = 0, len = handlers.length; i < len; i++) {
              if (handlers[i]) {
                ret = handlers[i].call(elem, e);
                if (ret === false) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }
            }
          };
        }
        if (!elem.events[event]) {
          elem.events[event] = [];
          if (elem.addEventListener)
            elem.addEventListener(event, elem.handle, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + event, elem.handle);
        }
        elem.events[event].push(handler);
      },
      remove: function (elem, event, handler) {
        var handlers = elem.events[event];
        for (var i = handlers.length - 1; i >= 0; i--) {
          if (handlers[i] === handler) {
            handlers.splice(i, 1);
          }
        }
        if (!handlers.length) {
          delete elem.events[event];
          if (elem.removeEventListener)
            elem.removeEventListener(event, elem.handle, false);
          else if (elem.detachEvent)
            elem.detachEvent("on" + event, elem.handle);
        }
      },
    };
  })(),
  queryElementsBySelector: function (selector, scope) {
    scope = scope || document;
    if (!selector) return [];
    if (selector === ">*") return scope.children;
    if (typeof document.querySelectorAll === "function") {
      return scope.querySelectorAll(selector);
    }
    var selectors = selector.split(",");
    var resultList = [];
    for (var s = 0; s < selectors.length; s++) {
      var currentContext = [scope || document];
      var tokens = selectors[s]
        .replace(/^\s+/, "")
        .replace(/\s+$/, "")
        .split(" ");
      for (var i = 0; i < tokens.length; i++) {
        token = tokens[i].replace(/^\s+/, "").replace(/\s+$/, "");
        if (token.indexOf("#") > -1) {
          var bits = token.split("#"),
            tagName = bits[0],
            id = bits[1];
          var element = document.getElementById(id);
          if (element && tagName && element.nodeName.toLowerCase() != tagName) {
            return [];
          }
          currentContext = element ? [element] : [];
          continue;
        }
        if (token.indexOf(".") > -1) {
          var bits = token.split("."),
            tagName = bits[0] || "*",
            className = bits[1],
            found = [],
            foundCount = 0;
          for (var h = 0; h < currentContext.length; h++) {
            var elements;
            if (tagName == "*") {
              elements = currentContext[h].getElementsByTagName("*");
            } else {
              elements = currentContext[h].getElementsByTagName(tagName);
            }
            for (var j = 0; j < elements.length; j++) {
              found[foundCount++] = elements[j];
            }
          }
          currentContext = [];
          var currentContextIndex = 0;
          for (var k = 0; k < found.length; k++) {
            if (
              found[k].className &&
              found[k].className.match(
                new RegExp("(\\s|^)" + className + "(\\s|$)")
              )
            ) {
              currentContext[currentContextIndex++] = found[k];
            }
          }
          continue;
        }
        if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
          var tagName = RegExp.$1 || "*",
            attrName = RegExp.$2,
            attrOperator = RegExp.$3,
            attrValue = RegExp.$4;
          if (
            attrName.toLowerCase() == "for" &&
            this.browser.msie &&
            this.browser.version < 8
          ) {
            attrName = "htmlFor";
          }
          var found = [],
            foundCount = 0;
          for (var h = 0; h < currentContext.length; h++) {
            var elements;
            if (tagName == "*") {
              elements = currentContext[h].getElementsByTagName("*");
            } else {
              elements = currentContext[h].getElementsByTagName(tagName);
            }
            for (var j = 0; elements[j]; j++) {
              found[foundCount++] = elements[j];
            }
          }
          currentContext = [];
          var currentContextIndex = 0,
            checkFunction;
          switch (attrOperator) {
            case "=":
              checkFunction = function (e) {
                return e.getAttribute(attrName) == attrValue;
              };
              break;
            case "~":
              checkFunction = function (e) {
                return e
                  .getAttribute(attrName)
                  .match(new RegExp("(\\s|^)" + attrValue + "(\\s|$)"));
              };
              break;
            case "|":
              checkFunction = function (e) {
                return e
                  .getAttribute(attrName)
                  .match(new RegExp("^" + attrValue + "-?"));
              };
              break;
            case "^":
              checkFunction = function (e) {
                return e.getAttribute(attrName).indexOf(attrValue) == 0;
              };
              break;
            case "$":
              checkFunction = function (e) {
                return (
                  e.getAttribute(attrName).lastIndexOf(attrValue) ==
                  e.getAttribute(attrName).length - attrValue.length
                );
              };
              break;
            case "*":
              checkFunction = function (e) {
                return e.getAttribute(attrName).indexOf(attrValue) > -1;
              };
              break;
            default:
              checkFunction = function (e) {
                return e.getAttribute(attrName);
              };
          }
          currentContext = [];
          var currentContextIndex = 0;
          for (var k = 0; k < found.length; k++) {
            if (checkFunction(found[k])) {
              currentContext[currentContextIndex++] = found[k];
            }
          }
          continue;
        }
        tagName = token;
        var found = [],
          foundCount = 0;
        for (var h = 0; h < currentContext.length; h++) {
          var elements = currentContext[h].getElementsByTagName(tagName);
          for (var j = 0; j < elements.length; j++) {
            found[foundCount++] = elements[j];
          }
        }
        currentContext = found;
      }
      resultList = [].concat(resultList, currentContext);
    }
    return resultList;
  },
  trim: function (str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
  },
  bind: function (f, scope, forceArgs) {
    return function () {
      return f.apply(
        scope,
        typeof forceArgs !== "undefined" ? [forceArgs] : arguments
      );
    };
  },
};

/*
 * jQuery <marquee> plugin
 */
(function ($) {
  function Marquee(options) {
    this.options = $.extend({
        holder: null,
        handleFlexible: true,
        pauseOnHover: true,
        hoverClass: "hover",
        direction: "left",
        cloneClass: "cloned",
        mask: null,
        line: ">*",
        items: ">*",
        animSpeed: 10, // px per second
        initialDelay: 0,
      },
      options
    );
    this.init();
  }
  Marquee.prototype = {
    init: function () {
      if (this.options.holder) {
        this.initStructure();
        this.attachEvents();
      }
    },
    initStructure: function () {
      // find elements
      this.holder = $(this.options.holder);
      (this.mask = this.options.mask ?
        this.holder.find(this.options.mask) :
        this.holder),
      (this.line = this.mask.find(this.options.line)),
      (this.items = this.line.find(this.options.items).css({
        float: "left",
      }));

      if (!this.line.length) return;

      this.direction = this.options.direction === "left" ? -1 : 1;
      this.recalculateDimensions();

      // prepare structure
      this.cloneItems = this.items
        .clone()
        .addClass(this.options.cloneClass)
        .appendTo(this.line);
      if (this.itemWidth >= this.maskWidth) {
        this.activeLine = true;
        this.offset = this.direction === -1 ? 0 : this.maxOffset;
      } else {
        this.activeLine = false;
        this.cloneItems.hide();
        this.offset = 0;
      }
      this.line.css({
        width: this.itemWidth * 2,
        transform: "translateX(" + this.offset + "px)",
      });
      this.isInit = true;
    },
    attachEvents: function () {
      // flexible layout handling
      var self = this;
      if (this.options.handleFlexible) {
        this.resizeHandler = function () {
          //if (!self.isInit) return;
          self.recalculateDimensions();

          if (self.itemWidth < self.maskWidth) {
            self.activeLine = false;
            self.cloneItems.hide();
            self.stopMoving();
            self.offset = 0;
            self.line.css({
              transform: "translateX(" + self.offset + "px)",
            });
          } else {
            self.activeLine = true;
            self.cloneItems.show();
            self.line.css({
              width: self.itemWidth * 2,
              transform: "translateX(" + self.offset + "px)",
            });
            self.startMoving();
          }
        };
        $(window).bind("resize orientationchange", this.resizeHandler);
      }

      // pause on hover
      if (this.options.pauseOnHover) {
        this.hoverHandler = function () {
          self.stopMoving();
          self.holder.addClass(self.options.hoverClass);
        };
        this.leaveHandler = function () {
          self.startMoving();
          self.holder.removeClass(self.options.hoverClass);
        };
        this.holder.bind({
          mouseenter: this.hoverHandler,
          mouseleave: this.leaveHandler,
        });
      }

      // initial delay
      setTimeout(function () {
        self.initialFlag = true;
        self.startMoving();
      }, self.options.initialDelay || 1);
    },
    recalculateDimensions: function () {
      // calculate block dimensions
      var self = this;
      this.maskWidth = this.mask.width();
      this.itemWidth = 1;
      this.items.each(function () {
        self.itemWidth += $(this).outerWidth(true);
      });
      this.maxOffset = -this.itemWidth;
    },
    startMoving: function () {
      // start animation
      var self = this;
      if (self.activeLine && self.initialFlag) {
        var targetOffset = self.direction < 0 ? self.maxOffset : 0;

        self.offset = getTranslateValues(self.line[0]).x || 0;
        self.line
          .stop()
          .attr("data-translate", self.offset)
          .animate({
            "data-translate": targetOffset,
          }, {
            duration: Math.abs(
              (1000 * (self.offset - targetOffset)) / self.options.animSpeed
            ),
            easing: "linear",
            step: function (now) {
              self.line.css({
                transform: "translateX(" + now + "px)",
              });
            },
            complete: function () {
              self.offset = self.direction < 0 ? 0 : self.maxOffset;
              self.line.css({
                transform: "translateX(" + self.offset + "px)",
              });
              self.startMoving();
            },
          });
      }
    },
    stopMoving: function () {
      // stop animation
      this.line.stop();
    },
    destroy: function () {
      this.isInit = false;
      this.stopMoving();
      this.cloneItems.remove();
      this.items.css({
        float: "",
      });
      this.line.css({
        transform: "",
        width: "",
      });
      this.holder.removeClass(this.options.hoverClass);
      this.holder.unbind("mouseenter", this.hoverHandler);
      this.holder.unbind("mouseleave", this.leaveHandler);
      $(window).unbind("resize orientationchange", this.resizeHandler);
    },
  };

  function getTranslateValues(element) {
    var style = window.getComputedStyle(element);
    var matrix =
      style["transform"] || style.webkitTransform || style.mozTransform;

    // No transform property. Simply return 0 values.
    if (matrix === "none" || typeof matrix === "undefined") {
      return {
        x: 0,
        y: 0,
        z: 0,
      };
    }

    // Can either be 2d or 3d transform
    var matrixType = matrix.includes("3d") ? "3d" : "2d";
    var matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

    // 2d matrices have 6 values
    // Last 2 values are X and Y.
    // 2d matrices does not have Z value.
    if (matrixType === "2d") {
      return {
        x: matrixValues[4],
        y: matrixValues[5],
        z: 0,
      };
    }

    // 3d matrices have 16 values
    // The 13th, 14th, and 15th values are X, Y, and Z
    if (matrixType === "3d") {
      return {
        x: matrixValues[12],
        y: matrixValues[13],
        z: matrixValues[14],
      };
    }
  }

  // jQuery plugin interface
  $.fn.marquee = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function () {
      var $holder = jQuery(this);
      var instance = $holder.data("Marquee");

      if (typeof opt === "object" || typeof opt === "undefined") {
        $holder.data(
          "Marquee",
          new Marquee(
            $.extend({
                holder: this,
              },
              opt
            )
          )
        );
      } else if (typeof method === "string" && instance) {
        if (typeof instance[method] === "function") {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
})(jQuery);

/*
 * jQuery Open/Close plugin
 */
(function ($) {
  function OpenClose(options) {
    this.options = $.extend({
        addClassBeforeAnimation: true,
        hideOnClickOutside: false,
        activeClass: "active",
        opener: ".opener",
        slider: ".slide",
        animSpeed: 400,
        effect: "fade",
        event: "click",
      },
      options
    );
    this.init();
  }
  OpenClose.prototype = {
    init: function () {
      if (this.options.holder) {
        this.findElements();
        this.attachEvents();
        this.makeCallback("onInit", this);
      }
    },
    findElements: function () {
      this.holder = $(this.options.holder);
      this.opener = this.holder.find(this.options.opener);
      this.slider = this.holder.find(this.options.slider);
    },
    attachEvents: function () {
      // add handler
      var self = this;
      this.eventHandler = function (e) {
        e.preventDefault();
        if (self.slider.hasClass(slideHiddenClass)) {
          self.showSlide();
        } else {
          self.hideSlide();
        }
      };
      self.opener.on(self.options.event, this.eventHandler);

      // hover mode handler
      if (self.options.event === "hover") {
        self.opener.on("mouseenter", function () {
          if (!self.holder.hasClass(self.options.activeClass)) {
            self.showSlide();
          }
        });
        self.holder.on("mouseleave", function () {
          self.hideSlide();
        });
      }

      // outside click handler
      self.outsideClickHandler = function (e) {
        if (self.options.hideOnClickOutside) {
          var target = $(e.target);
          if (!target.is(self.holder) && !target.closest(self.holder).length) {
            self.hideSlide();
          }
        }
      };

      // set initial styles
      if (this.holder.hasClass(this.options.activeClass)) {
        $(document).on("click touchstart", self.outsideClickHandler);
      } else {
        this.slider.addClass(slideHiddenClass);
      }
    },
    showSlide: function () {
      var self = this;
      if (self.options.addClassBeforeAnimation) {
        self.holder.addClass(self.options.activeClass);
      }
      self.slider.removeClass(slideHiddenClass);
      $(document).on("click touchstart", self.outsideClickHandler);

      self.makeCallback("animStart", true);
      toggleEffects[self.options.effect].show({
        box: self.slider,
        speed: self.options.animSpeed,
        complete: function () {
          if (!self.options.addClassBeforeAnimation) {
            self.holder.addClass(self.options.activeClass);
          }
          self.makeCallback("animEnd", true);
        },
      });
    },
    hideSlide: function () {
      var self = this;
      if (self.options.addClassBeforeAnimation) {
        self.holder.removeClass(self.options.activeClass);
      }
      $(document).off("click touchstart", self.outsideClickHandler);

      self.makeCallback("animStart", false);
      toggleEffects[self.options.effect].hide({
        box: self.slider,
        speed: self.options.animSpeed,
        complete: function () {
          if (!self.options.addClassBeforeAnimation) {
            self.holder.removeClass(self.options.activeClass);
          }
          self.slider.addClass(slideHiddenClass);
          self.makeCallback("animEnd", false);
        },
      });
    },
    destroy: function () {
      this.slider.removeClass(slideHiddenClass).css({
        display: "",
      });
      this.opener.off(this.options.event, this.eventHandler);
      this.holder.removeClass(this.options.activeClass).removeData("OpenClose");
      $(document).off("click touchstart", this.outsideClickHandler);
    },
    makeCallback: function (name) {
      if (typeof this.options[name] === "function") {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },
  };

  // add stylesheet for slide on DOMReady
  var slideHiddenClass = "js-slide-hidden";
  (function () {
    var tabStyleSheet = $('<style type="text/css">')[0];
    var tabStyleRule = "." + slideHiddenClass;
    tabStyleRule +=
      "{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}";
    if (tabStyleSheet.styleSheet) {
      tabStyleSheet.styleSheet.cssText = tabStyleRule;
    } else {
      tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
    }
    $("head").append(tabStyleSheet);
  })();

  // animation effects
  var toggleEffects = {
    slide: {
      show: function (o) {
        o.box.stop(true).hide().slideDown(o.speed, o.complete);
      },
      hide: function (o) {
        o.box.stop(true).slideUp(o.speed, o.complete);
      },
    },
    fade: {
      show: function (o) {
        o.box.stop(true).hide().fadeIn(o.speed, o.complete);
      },
      hide: function (o) {
        o.box.stop(true).fadeOut(o.speed, o.complete);
      },
    },
    none: {
      show: function (o) {
        o.box.hide().show(0, o.complete);
      },
      hide: function (o) {
        o.box.hide(0, o.complete);
      },
    },
  };

  // jQuery plugin interface
  $.fn.openClose = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function () {
      var $holder = jQuery(this);
      var instance = $holder.data("OpenClose");

      if (typeof opt === "object" || typeof opt === "undefined") {
        $holder.data(
          "OpenClose",
          new OpenClose(
            $.extend({
                holder: this,
              },
              opt
            )
          )
        );
      } else if (typeof method === "string" && instance) {
        if (typeof instance[method] === "function") {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
})(jQuery);

/*
 * jQuery Accordion plugin new
 */
;
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.SlideAccordion = factory(jQuery);
  }
}(this, function ($) {
  'use strict';
  var accHiddenClass = 'js-acc-hidden';

  function SlideAccordion(options) {
    this.options = $.extend(true, {
      allowClickWhenExpanded: false,
      activeClass: 'active',
      opener: '.opener',
      slider: '.slide',
      animSpeed: 300,
      collapsible: true,
      event: 'click',
      scrollToActiveItem: {
        enable: false,
        breakpoint: 767, // max-width
        animSpeed: 600,
        extraOffset: null
      }
    }, options);
    this.init();
  }

  SlideAccordion.prototype = {
    init: function () {
      if (this.options.holder) {
        this.findElements();
        this.setStateOnInit();
        this.attachEvents();
        this.makeCallback('onInit');
      }
    },

    findElements: function () {
      this.$holder = $(this.options.holder).data('SlideAccordion', this);
      this.$items = this.$holder.find(':has(' + this.options.slider + ')');
    },

    setStateOnInit: function () {
      var self = this;

      this.$items.each(function () {
        if (!$(this).hasClass(self.options.activeClass)) {
          $(this).find(self.options.slider).addClass(accHiddenClass);
        }
      });
    },

    attachEvents: function () {
      var self = this;

      this.accordionToggle = function (e) {
        var $item = jQuery(this).closest(self.$items);
        var $actiItem = self.getActiveItem($item);

        if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
          e.preventDefault();
          self.toggle($item, $actiItem);
        }
      };

      this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
    },

    toggle: function ($item, $prevItem) {
      if (!$item.hasClass(this.options.activeClass)) {
        this.show($item);
      } else if (this.options.collapsible) {
        this.hide($item);
      }

      if (!$item.is($prevItem) && $prevItem.length) {
        this.hide($prevItem);
      }

      this.makeCallback('beforeToggle');
    },

    show: function ($item) {
      var $slider = $item.find(this.options.slider);

      $item.addClass(this.options.activeClass);
      $slider.stop().hide().removeClass(accHiddenClass).slideDown({
        duration: this.options.animSpeed,
        complete: function () {
          $slider.removeAttr('style');
          if (
            this.options.scrollToActiveItem.enable &&
            window.innerWidth <= this.options.scrollToActiveItem.breakpoint
          ) {
            this.goToItem($item);
          }
          this.makeCallback('onShow', $item);
        }.bind(this)
      });

      this.makeCallback('beforeShow', $item);
    },

    hide: function ($item) {
      var $slider = $item.find(this.options.slider);

      $item.removeClass(this.options.activeClass);
      $slider.stop().show().slideUp({
        duration: this.options.animSpeed,
        complete: function () {
          $slider.addClass(accHiddenClass);
          $slider.removeAttr('style');
          this.makeCallback('onHide', $item);
        }.bind(this)
      });

      this.makeCallback('beforeHide', $item);
    },

    goToItem: function ($item) {
      var itemOffset = $item.offset().top;

      if (itemOffset < $(window).scrollTop()) {
        // handle extra offset
        if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
          itemOffset -= this.options.scrollToActiveItem.extraOffset;
        } else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
          itemOffset -= this.options.scrollToActiveItem.extraOffset();
        }

        $('body, html').animate({
          scrollTop: itemOffset
        }, this.options.scrollToActiveItem.animSpeed);
      }
    },

    getActiveItem: function ($item) {
      return $item.siblings().filter('.' + this.options.activeClass);
    },

    makeCallback: function (name) {
      if (typeof this.options[name] === 'function') {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },

    destroy: function () {
      this.$holder.removeData('SlideAccordion');
      this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
      this.$items.removeClass(this.options.activeClass).each(function (i, item) {
        $(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
      }.bind(this));
      this.makeCallback('onDestroy');
    }
  };

  $.fn.slideAccordion = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];

    return this.each(function () {
      var $holder = jQuery(this);
      var instance = $holder.data('SlideAccordion');

      if (typeof opt === 'object' || typeof opt === 'undefined') {
        new SlideAccordion($.extend(true, {
          holder: this
        }, opt));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };

  (function () {
    var tabStyleSheet = $('<style type="text/css">')[0];
    var tabStyleRule = '.' + accHiddenClass;
    tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
    if (tabStyleSheet.styleSheet) {
      tabStyleSheet.styleSheet.cssText = tabStyleRule;
    } else {
      tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
    }
    $('head').append(tabStyleSheet);
  }());

  return SlideAccordion;
}));

/*! skrollr 0.6.30 (2015-08-12) | Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr | Free to use under terms of MIT license */
! function (a, b, c) {
  "use strict";

  function d(c) {
    if (e = b.documentElement, f = b.body, T(), ha = this, c = c || {}, ma = c.constants || {}, c.easing)
      for (var d in c.easing) W[d] = c.easing[d];
    ta = c.edgeStrategy || "set", ka = {
      beforerender: c.beforerender,
      render: c.render,
      keyframe: c.keyframe
    }, la = c.forceHeight !== !1, la && (Ka = c.scale || 1), na = c.mobileDeceleration || y, pa = c.smoothScrolling !== !1, qa = c.smoothScrollingDuration || A, ra = {
      targetTop: ha.getScrollTop()
    }, Sa = (c.mobileCheck || function () {
      return /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent || navigator.vendor || a.opera)
    })(), Sa ? (ja = b.getElementById(c.skrollrBody || z), ja && ga(), X(), Ea(e, [s, v], [t])) : Ea(e, [s, u], [t]), ha.refresh(), wa(a, "resize orientationchange", function () {
      var a = e.clientWidth,
        b = e.clientHeight;
      (b !== Pa || a !== Oa) && (Pa = b, Oa = a, Qa = !0)
    });
    var g = U();
    return function h() {
      $(), va = g(h)
    }(), ha
  }
  var e, f, g = {
      get: function () {
        return ha
      },
      init: function (a) {
        return ha || new d(a)
      },
      VERSION: "0.6.30"
    },
    h = Object.prototype.hasOwnProperty,
    i = a.Math,
    j = a.getComputedStyle,
    k = "touchstart",
    l = "touchmove",
    m = "touchcancel",
    n = "touchend",
    o = "skrollable",
    p = o + "-before",
    q = o + "-between",
    r = o + "-after",
    s = "skrollr",
    t = "no-" + s,
    u = s + "-desktop",
    v = s + "-mobile",
    w = "linear",
    x = 1e3,
    y = .004,
    z = "skrollr-body",
    A = 200,
    B = "start",
    C = "end",
    D = "center",
    E = "bottom",
    F = "___skrollable_id",
    G = /^(?:input|textarea|button|select)$/i,
    H = /^\s+|\s+$/g,
    I = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,
    J = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,
    K = /^(@?[a-z\-]+)\[(\w+)\]$/,
    L = /-([a-z0-9_])/g,
    M = function (a, b) {
      return b.toUpperCase()
    },
    N = /[\-+]?[\d]*\.?[\d]+/g,
    O = /\{\?\}/g,
    P = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,
    Q = /[a-z\-]+-gradient/g,
    R = "",
    S = "",
    T = function () {
      var a = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
      if (j) {
        var b = j(f, null);
        for (var c in b)
          if (R = c.match(a) || +c == c && b[c].match(a)) break;
        if (!R) return void(R = S = "");
        R = R[0], "-" === R.slice(0, 1) ? (S = R, R = {
          "-webkit-": "webkit",
          "-moz-": "Moz",
          "-ms-": "ms",
          "-o-": "O"
        } [R]) : S = "-" + R.toLowerCase() + "-"
      }
    },
    U = function () {
      var b = a.requestAnimationFrame || a[R.toLowerCase() + "RequestAnimationFrame"],
        c = Ha();
      return (Sa || !b) && (b = function (b) {
        var d = Ha() - c,
          e = i.max(0, 1e3 / 60 - d);
        return a.setTimeout(function () {
          c = Ha(), b()
        }, e)
      }), b
    },
    V = function () {
      var b = a.cancelAnimationFrame || a[R.toLowerCase() + "CancelAnimationFrame"];
      return (Sa || !b) && (b = function (b) {
        return a.clearTimeout(b)
      }), b
    },
    W = {
      begin: function () {
        return 0
      },
      end: function () {
        return 1
      },
      linear: function (a) {
        return a
      },
      quadratic: function (a) {
        return a * a
      },
      cubic: function (a) {
        return a * a * a
      },
      swing: function (a) {
        return -i.cos(a * i.PI) / 2 + .5
      },
      sqrt: function (a) {
        return i.sqrt(a)
      },
      outCubic: function (a) {
        return i.pow(a - 1, 3) + 1
      },
      bounce: function (a) {
        var b;
        if (.5083 >= a) b = 3;
        else if (.8489 >= a) b = 9;
        else if (.96208 >= a) b = 27;
        else {
          if (!(.99981 >= a)) return 1;
          b = 91
        }
        return 1 - i.abs(3 * i.cos(a * b * 1.028) / b)
      }
    };
  d.prototype.refresh = function (a) {
    var d, e, f = !1;
    for (a === c ? (f = !0, ia = [], Ra = 0, a = b.getElementsByTagName("*")) : a.length === c && (a = [a]), d = 0, e = a.length; e > d; d++) {
      var g = a[d],
        h = g,
        i = [],
        j = pa,
        k = ta,
        l = !1;
      if (f && F in g && delete g[F], g.attributes) {
        for (var m = 0, n = g.attributes.length; n > m; m++) {
          var p = g.attributes[m];
          if ("data-anchor-target" !== p.name)
            if ("data-smooth-scrolling" !== p.name)
              if ("data-edge-strategy" !== p.name)
                if ("data-emit-events" !== p.name) {
                  var q = p.name.match(I);
                  if (null !== q) {
                    var r = {
                      props: p.value,
                      element: g,
                      eventType: p.name.replace(L, M)
                    };
                    i.push(r);
                    var s = q[1];
                    s && (r.constant = s.substr(1));
                    var t = q[2];
                    /p$/.test(t) ? (r.isPercentage = !0, r.offset = (0 | t.slice(0, -1)) / 100) : r.offset = 0 | t;
                    var u = q[3],
                      v = q[4] || u;
                    u && u !== B && u !== C ? (r.mode = "relative", r.anchors = [u, v]) : (r.mode = "absolute", u === C ? r.isEnd = !0 : r.isPercentage || (r.offset = r.offset * Ka))
                  }
                } else l = !0;
          else k = p.value;
          else j = "off" !== p.value;
          else if (h = b.querySelector(p.value), null === h) throw 'Unable to find anchor target "' + p.value + '"'
        }
        if (i.length) {
          var w, x, y;
          !f && F in g ? (y = g[F], w = ia[y].styleAttr, x = ia[y].classAttr) : (y = g[F] = Ra++, w = g.style.cssText, x = Da(g)), ia[y] = {
            element: g,
            styleAttr: w,
            classAttr: x,
            anchorTarget: h,
            keyFrames: i,
            smoothScrolling: j,
            edgeStrategy: k,
            emitEvents: l,
            lastFrameIndex: -1
          }, Ea(g, [o], [])
        }
      }
    }
    for (Aa(), d = 0, e = a.length; e > d; d++) {
      var z = ia[a[d][F]];
      z !== c && (_(z), ba(z))
    }
    return ha
  }, d.prototype.relativeToAbsolute = function (a, b, c) {
    var d = e.clientHeight,
      f = a.getBoundingClientRect(),
      g = f.top,
      h = f.bottom - f.top;
    return b === E ? g -= d : b === D && (g -= d / 2), c === E ? g += h : c === D && (g += h / 2), g += ha.getScrollTop(), g + .5 | 0
  }, d.prototype.animateTo = function (a, b) {
    b = b || {};
    var d = Ha(),
      e = ha.getScrollTop(),
      f = b.duration === c ? x : b.duration;
    return oa = {
      startTop: e,
      topDiff: a - e,
      targetTop: a,
      duration: f,
      startTime: d,
      endTime: d + f,
      easing: W[b.easing || w],
      done: b.done
    }, oa.topDiff || (oa.done && oa.done.call(ha, !1), oa = c), ha
  }, d.prototype.stopAnimateTo = function () {
    oa && oa.done && oa.done.call(ha, !0), oa = c
  }, d.prototype.isAnimatingTo = function () {
    return !!oa
  }, d.prototype.isMobile = function () {
    return Sa
  }, d.prototype.setScrollTop = function (b, c) {
    return sa = c === !0, Sa ? Ta = i.min(i.max(b, 0), Ja) : a.scrollTo(0, b), ha
  }, d.prototype.getScrollTop = function () {
    return Sa ? Ta : a.pageYOffset || e.scrollTop || f.scrollTop || 0
  }, d.prototype.getMaxScrollTop = function () {
    return Ja
  }, d.prototype.on = function (a, b) {
    return ka[a] = b, ha
  }, d.prototype.off = function (a) {
    return delete ka[a], ha
  }, d.prototype.destroy = function () {
    var a = V();
    a(va), ya(), Ea(e, [t], [s, u, v]);
    for (var b = 0, d = ia.length; d > b; b++) fa(ia[b].element);
    e.style.overflow = f.style.overflow = "", e.style.height = f.style.height = "", ja && g.setStyle(ja, "transform", "none"), ha = c, ja = c, ka = c, la = c, Ja = 0, Ka = 1, ma = c, na = c, La = "down", Ma = -1, Oa = 0, Pa = 0, Qa = !1, oa = c, pa = c, qa = c, ra = c, sa = c, Ra = 0, ta = c, Sa = !1, Ta = 0, ua = c
  };
  var X = function () {
      var d, g, h, j, o, p, q, r, s, t, u, v;
      wa(e, [k, l, m, n].join(" "), function (a) {
        var e = a.changedTouches[0];
        for (j = a.target; 3 === j.nodeType;) j = j.parentNode;
        switch (o = e.clientY, p = e.clientX, t = a.timeStamp, G.test(j.tagName) || a.preventDefault(), a.type) {
          case k:
            d && d.blur(), ha.stopAnimateTo(), d = j, g = q = o, h = p, s = t;
            break;
          case l:
            G.test(j.tagName) && b.activeElement !== j && a.preventDefault(), r = o - q, v = t - u, ha.setScrollTop(Ta - r, !0), q = o, u = t;
            break;
          default:
          case m:
          case n:
            var f = g - o,
              w = h - p,
              x = w * w + f * f;
            if (49 > x) {
              if (!G.test(d.tagName)) {
                d.focus();
                var y = b.createEvent("MouseEvents");
                y.initMouseEvent("click", !0, !0, a.view, 1, e.screenX, e.screenY, e.clientX, e.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, 0, null), d.dispatchEvent(y)
              }
              return
            }
            d = c;
            var z = r / v;
            z = i.max(i.min(z, 3), -3);
            var A = i.abs(z / na),
              B = z * A + .5 * na * A * A,
              C = ha.getScrollTop() - B,
              D = 0;
            C > Ja ? (D = (Ja - C) / B, C = Ja) : 0 > C && (D = -C / B, C = 0), A *= 1 - D, ha.animateTo(C + .5 | 0, {
              easing: "outCubic",
              duration: A
            })
        }
      }), a.scrollTo(0, 0), e.style.overflow = f.style.overflow = "hidden"
    },
    Y = function () {
      var a, b, c, d, f, g, h, j, k, l, m, n = e.clientHeight,
        o = Ba();
      for (j = 0, k = ia.length; k > j; j++)
        for (a = ia[j], b = a.element, c = a.anchorTarget, d = a.keyFrames, f = 0, g = d.length; g > f; f++) h = d[f], l = h.offset, m = o[h.constant] || 0, h.frame = l, h.isPercentage && (l *= n, h.frame = l), "relative" === h.mode && (fa(b), h.frame = ha.relativeToAbsolute(c, h.anchors[0], h.anchors[1]) - l, fa(b, !0)), h.frame += m, la && !h.isEnd && h.frame > Ja && (Ja = h.frame);
      for (Ja = i.max(Ja, Ca()), j = 0, k = ia.length; k > j; j++) {
        for (a = ia[j], d = a.keyFrames, f = 0, g = d.length; g > f; f++) h = d[f], m = o[h.constant] || 0, h.isEnd && (h.frame = Ja - h.offset + m);
        a.keyFrames.sort(Ia)
      }
    },
    Z = function (a, b) {
      for (var c = 0, d = ia.length; d > c; c++) {
        var e, f, i = ia[c],
          j = i.element,
          k = i.smoothScrolling ? a : b,
          l = i.keyFrames,
          m = l.length,
          n = l[0],
          s = l[l.length - 1],
          t = k < n.frame,
          u = k > s.frame,
          v = t ? n : s,
          w = i.emitEvents,
          x = i.lastFrameIndex;
        if (t || u) {
          if (t && -1 === i.edge || u && 1 === i.edge) continue;
          switch (t ? (Ea(j, [p], [r, q]), w && x > -1 && (za(j, n.eventType, La), i.lastFrameIndex = -1)) : (Ea(j, [r], [p, q]), w && m > x && (za(j, s.eventType, La), i.lastFrameIndex = m)), i.edge = t ? -1 : 1, i.edgeStrategy) {
            case "reset":
              fa(j);
              continue;
            case "ease":
              k = v.frame;
              break;
            default:
            case "set":
              var y = v.props;
              for (e in y) h.call(y, e) && (f = ea(y[e].value), 0 === e.indexOf("@") ? j.setAttribute(e.substr(1), f) : g.setStyle(j, e, f));
              continue
          }
        } else 0 !== i.edge && (Ea(j, [o, q], [p, r]), i.edge = 0);
        for (var z = 0; m - 1 > z; z++)
          if (k >= l[z].frame && k <= l[z + 1].frame) {
            var A = l[z],
              B = l[z + 1];
            for (e in A.props)
              if (h.call(A.props, e)) {
                var C = (k - A.frame) / (B.frame - A.frame);
                C = A.props[e].easing(C), f = da(A.props[e].value, B.props[e].value, C), f = ea(f), 0 === e.indexOf("@") ? j.setAttribute(e.substr(1), f) : g.setStyle(j, e, f)
              } w && x !== z && ("down" === La ? za(j, A.eventType, La) : za(j, B.eventType, La), i.lastFrameIndex = z);
            break
          }
      }
    },
    $ = function () {
      Qa && (Qa = !1, Aa());
      var a, b, d = ha.getScrollTop(),
        e = Ha();
      if (oa) e >= oa.endTime ? (d = oa.targetTop, a = oa.done, oa = c) : (b = oa.easing((e - oa.startTime) / oa.duration), d = oa.startTop + b * oa.topDiff | 0), ha.setScrollTop(d, !0);
      else if (!sa) {
        var f = ra.targetTop - d;
        f && (ra = {
          startTop: Ma,
          topDiff: d - Ma,
          targetTop: d,
          startTime: Na,
          endTime: Na + qa
        }), e <= ra.endTime && (b = W.sqrt((e - ra.startTime) / qa), d = ra.startTop + b * ra.topDiff | 0)
      }
      if (sa || Ma !== d) {
        La = d > Ma ? "down" : Ma > d ? "up" : La, sa = !1;
        var h = {
            curTop: d,
            lastTop: Ma,
            maxTop: Ja,
            direction: La
          },
          i = ka.beforerender && ka.beforerender.call(ha, h);
        i !== !1 && (Z(d, ha.getScrollTop()), Sa && ja && g.setStyle(ja, "transform", "translate(0, " + -Ta + "px) " + ua), Ma = d, ka.render && ka.render.call(ha, h)), a && a.call(ha, !1)
      }
      Na = e
    },
    _ = function (a) {
      for (var b = 0, c = a.keyFrames.length; c > b; b++) {
        for (var d, e, f, g, h = a.keyFrames[b], i = {}; null !== (g = J.exec(h.props));) f = g[1], e = g[2], d = f.match(K), null !== d ? (f = d[1], d = d[2]) : d = w, e = e.indexOf("!") ? aa(e) : [e.slice(1)], i[f] = {
          value: e,
          easing: W[d]
        };
        h.props = i
      }
    },
    aa = function (a) {
      var b = [];
      return P.lastIndex = 0, a = a.replace(P, function (a) {
        return a.replace(N, function (a) {
          return a / 255 * 100 + "%"
        })
      }), S && (Q.lastIndex = 0, a = a.replace(Q, function (a) {
        return S + a
      })), a = a.replace(N, function (a) {
        return b.push(+a), "{?}"
      }), b.unshift(a), b
    },
    ba = function (a) {
      var b, c, d = {};
      for (b = 0, c = a.keyFrames.length; c > b; b++) ca(a.keyFrames[b], d);
      for (d = {}, b = a.keyFrames.length - 1; b >= 0; b--) ca(a.keyFrames[b], d)
    },
    ca = function (a, b) {
      var c;
      for (c in b) h.call(a.props, c) || (a.props[c] = b[c]);
      for (c in a.props) b[c] = a.props[c]
    },
    da = function (a, b, c) {
      var d, e = a.length;
      if (e !== b.length) throw "Can't interpolate between \"" + a[0] + '" and "' + b[0] + '"';
      var f = [a[0]];
      for (d = 1; e > d; d++) f[d] = a[d] + (b[d] - a[d]) * c;
      return f
    },
    ea = function (a) {
      var b = 1;
      return O.lastIndex = 0, a[0].replace(O, function () {
        return a[b++]
      })
    },
    fa = function (a, b) {
      a = [].concat(a);
      for (var c, d, e = 0, f = a.length; f > e; e++) d = a[e], c = ia[d[F]], c && (b ? (d.style.cssText = c.dirtyStyleAttr, Ea(d, c.dirtyClassAttr)) : (c.dirtyStyleAttr = d.style.cssText, c.dirtyClassAttr = Da(d), d.style.cssText = c.styleAttr, Ea(d, c.classAttr)))
    },
    ga = function () {
      ua = "translateZ(0)", g.setStyle(ja, "transform", ua);
      var a = j(ja),
        b = a.getPropertyValue("transform"),
        c = a.getPropertyValue(S + "transform"),
        d = b && "none" !== b || c && "none" !== c;
      d || (ua = "")
    };
  g.setStyle = function (a, b, c) {
    var d = a.style;
    if (b = b.replace(L, M).replace("-", ""), "zIndex" === b) isNaN(c) ? d[b] = c : d[b] = "" + (0 | c);
    else if ("float" === b) d.styleFloat = d.cssFloat = c;
    else try {
      R && (d[R + b.slice(0, 1).toUpperCase() + b.slice(1)] = c), d[b] = c
    } catch (e) {}
  };
  var ha, ia, ja, ka, la, ma, na, oa, pa, qa, ra, sa, ta, ua, va, wa = g.addEvent = function (b, c, d) {
      var e = function (b) {
        return b = b || a.event, b.target || (b.target = b.srcElement), b.preventDefault || (b.preventDefault = function () {
          b.returnValue = !1, b.defaultPrevented = !0
        }), d.call(this, b)
      };
      c = c.split(" ");
      for (var f, g = 0, h = c.length; h > g; g++) f = c[g], b.addEventListener ? b.addEventListener(f, d, !1) : b.attachEvent("on" + f, e), Ua.push({
        element: b,
        name: f,
        listener: d
      })
    },
    xa = g.removeEvent = function (a, b, c) {
      b = b.split(" ");
      for (var d = 0, e = b.length; e > d; d++) a.removeEventListener ? a.removeEventListener(b[d], c, !1) : a.detachEvent("on" + b[d], c)
    },
    ya = function () {
      for (var a, b = 0, c = Ua.length; c > b; b++) a = Ua[b], xa(a.element, a.name, a.listener);
      Ua = []
    },
    za = function (a, b, c) {
      ka.keyframe && ka.keyframe.call(ha, a, b, c)
    },
    Aa = function () {
      var a = ha.getScrollTop();
      Ja = 0, la && !Sa && (f.style.height = ""), Y(), la && !Sa && (f.style.height = Ja + e.clientHeight + "px"), Sa ? ha.setScrollTop(i.min(ha.getScrollTop(), Ja)) : ha.setScrollTop(a, !0), sa = !0
    },
    Ba = function () {
      var a, b, c = e.clientHeight,
        d = {};
      for (a in ma) b = ma[a], "function" == typeof b ? b = b.call(ha) : /p$/.test(b) && (b = b.slice(0, -1) / 100 * c), d[a] = b;
      return d
    },
    Ca = function () {
      var a, b = 0;
      return ja && (b = i.max(ja.offsetHeight, ja.scrollHeight)), a = i.max(b, f.scrollHeight, f.offsetHeight, e.scrollHeight, e.offsetHeight, e.clientHeight), a - e.clientHeight
    },
    Da = function (b) {
      var c = "className";
      return a.SVGElement && b instanceof a.SVGElement && (b = b[c], c = "baseVal"), b[c]
    },
    Ea = function (b, d, e) {
      var f = "className";
      if (a.SVGElement && b instanceof a.SVGElement && (b = b[f], f = "baseVal"), e === c) return void(b[f] = d);
      for (var g = b[f], h = 0, i = e.length; i > h; h++) g = Ga(g).replace(Ga(e[h]), " ");
      g = Fa(g);
      for (var j = 0, k = d.length; k > j; j++) - 1 === Ga(g).indexOf(Ga(d[j])) && (g += " " + d[j]);
      b[f] = Fa(g)
    },
    Fa = function (a) {
      return a.replace(H, "")
    },
    Ga = function (a) {
      return " " + a + " "
    },
    Ha = Date.now || function () {
      return +new Date
    },
    Ia = function (a, b) {
      return a.frame - b.frame
    },
    Ja = 0,
    Ka = 1,
    La = "down",
    Ma = -1,
    Na = Ha(),
    Oa = 0,
    Pa = 0,
    Qa = !1,
    Ra = 0,
    Sa = !1,
    Ta = 0,
    Ua = [];
  "function" == typeof define && define.amd ? define([], function () {
    return g
  }) : "undefined" != typeof module && module.exports ? module.exports = g : a.skrollr = g
}(window, document);


/* https://unpkg.com/splitting@1.0.6/dist/splitting.js */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Splitting = factory());
}(this, (function () {
  'use strict';

  var root = document;
  var createText = root.createTextNode.bind(root);

  /**
   * # setProperty
   * Apply a CSS var
   * @param {HTMLElement} el
   * @param {string} varName 
   * @param {string|number} value 
   */
  function setProperty(el, varName, value) {
    el.style.setProperty(varName, value);
  }

  /**
   * 
   * @param {!HTMLElement} el 
   * @param {!HTMLElement} child 
   */
  function appendChild(el, child) {
    return el.appendChild(child);
  }

  /**
   * 
   * @param {!HTMLElement} parent 
   * @param {string} key 
   * @param {string} text 
   * @param {boolean} whitespace 
   */
  function createElement(parent, key, text, whitespace) {
    var el = root.createElement('span');
    key && (el.className = key);
    if (text) {
      !whitespace && el.setAttribute("data-" + key, text);
      el.textContent = text;
    }
    return (parent && appendChild(parent, el)) || el;
  }

  /**
   * 
   * @param {!HTMLElement} el 
   * @param {string} key 
   */
  function getData(el, key) {
    return el.getAttribute("data-" + key)
  }

  /**
   * 
   * @param {import('../types').Target} e 
   * @param {!HTMLElement} parent
   * @returns {!Array<!HTMLElement>}
   */
  function $(e, parent) {
    return !e || e.length == 0 ? // null or empty string returns empty array
      [] :
      e.nodeName ? // a single element is wrapped in an array
      [e] : // selector and NodeList are converted to Element[]
      [].slice.call(e[0].nodeName ? e : (parent || root).querySelectorAll(e));
  }

  /**
   * Creates and fills an array with the value provided
   * @param {number} len
   * @param {() => T} valueProvider
   * @return {T}
   * @template T
   */
  function Array2D(len) {
    var a = [];
    for (; len--;) {
      a[len] = [];
    }
    return a;
  }

  /**
   * A for loop wrapper used to reduce js minified size.
   * @param {!Array<T>} items 
   * @param {function(T):void} consumer
   * @template T
   */
  function each(items, consumer) {
    items && items.some(consumer);
  }

  /**
   * @param {T} obj 
   * @return {function(string):*}
   * @template T
   */
  function selectFrom(obj) {
    return function (key) {
      return obj[key];
    }
  }

  /**
   * # Splitting.index
   * Index split elements and add them to a Splitting instance.
   *
   * @param {HTMLElement} element
   * @param {string} key 
   * @param {!Array<!HTMLElement> | !Array<!Array<!HTMLElement>>} items 
   */
  function index(element, key, items) {
    var prefix = '--' + key;
    var cssVar = prefix + "-index";

    each(items, function (items, i) {
      if (Array.isArray(items)) {
        each(items, function (item) {
          setProperty(item, cssVar, i);
        });
      } else {
        setProperty(items, cssVar, i);
      }
    });

    setProperty(element, prefix + "-total", items.length);
  }

  /**
   * @type {Record<string, import('./types').ISplittingPlugin>}
   */
  var plugins = {};

  /**
   * @param {string} by
   * @param {string} parent
   * @param {!Array<string>} deps
   * @return {!Array<string>}
   */
  function resolvePlugins(by, parent, deps) {
    // skip if already visited this dependency
    var index = deps.indexOf(by);
    if (index == -1) {
      // if new to dependency array, add to the beginning
      deps.unshift(by);

      // recursively call this function for all dependencies
      var plugin = plugins[by];
      if (!plugin) {
        throw new Error("plugin not loaded: " + by);
      }
      each(plugin.depends, function (p) {
        resolvePlugins(p, by, deps);
      });
    } else {
      // if this dependency was added already move to the left of
      // the parent dependency so it gets loaded in order
      var indexOfParent = deps.indexOf(parent);
      deps.splice(index, 1);
      deps.splice(indexOfParent, 0, by);
    }
    return deps;
  }

  /**
   * Internal utility for creating plugins... essentially to reduce
   * the size of the library
   * @param {string} by 
   * @param {string} key 
   * @param {string[]} depends 
   * @param {Function} split 
   * @returns {import('./types').ISplittingPlugin}
   */
  function createPlugin(by, depends, key, split) {
    return {
      by: by,
      depends: depends,
      key: key,
      split: split
    }
  }

  /**
   *
   * @param {string} by
   * @returns {import('./types').ISplittingPlugin[]}
   */
  function resolve(by) {
    return resolvePlugins(by, 0, []).map(selectFrom(plugins));
  }

  /**
   * Adds a new plugin to splitting
   * @param {import('./types').ISplittingPlugin} opts
   */
  function add(opts) {
    plugins[opts.by] = opts;
  }

  /**
   * # Splitting.split
   * Split an element's textContent into individual elements
   * @param {!HTMLElement} el  Element to split
   * @param {string} key 
   * @param {string} splitOn 
   * @param {boolean} includePrevious 
   * @param {boolean} preserveWhitespace
   * @return {!Array<!HTMLElement>}
   */
  function splitText(el, key, splitOn, includePrevious, preserveWhitespace) {
    // Combine any strange text nodes or empty whitespace.
    el.normalize();

    // Use fragment to prevent unnecessary DOM thrashing.
    var elements = [];
    var F = document.createDocumentFragment();

    if (includePrevious) {
      elements.push(el.previousSibling);
    }

    var allElements = [];
    $(el.childNodes).some(function (next) {
      if (next.tagName && !next.hasChildNodes()) {
        // keep elements without child nodes (no text and no children)
        allElements.push(next);
        return;
      }
      // Recursively run through child nodes
      if (next.childNodes && next.childNodes.length) {
        allElements.push(next);
        elements.push.apply(elements, splitText(next, key, splitOn, includePrevious, preserveWhitespace));
        return;
      }

      // Get the text to split, trimming out the whitespace
      /** @type {string} */
      var wholeText = next.wholeText || '';
      var contents = wholeText.trim();

      // If there's no text left after trimming whitespace, continue the loop
      if (contents.length) {
        // insert leading space if there was one
        if (wholeText[0] === ' ') {
          allElements.push(createText(' '));
        }
        // Concatenate the split text children back into the full array
        each(contents.split(splitOn), function (splitText, i) {
          if (i && preserveWhitespace) {
            allElements.push(createElement(F, "whitespace", " ", preserveWhitespace));
          }
          var splitEl = createElement(F, key, splitText);
          elements.push(splitEl);
          allElements.push(splitEl);
        });
        // insert trailing space if there was one
        if (wholeText[wholeText.length - 1] === ' ') {
          allElements.push(createText(' '));
        }
      }
    });

    each(allElements, function (el) {
      appendChild(F, el);
    });

    // Clear out the existing element
    el.innerHTML = "";
    appendChild(el, F);
    return elements;
  }

  /** an empty value */
  var _ = 0;

  function copy(dest, src) {
    for (var k in src) {
      dest[k] = src[k];
    }
    return dest;
  }

  var WORDS = 'words';

  var wordPlugin = createPlugin(
    /* by= */
    WORDS,
    /* depends= */
    _,
    /* key= */
    'word',
    /* split= */
    function (el) {
      return splitText(el, 'word', /\s+/, 0, 1)
    }
  );

  var CHARS = "chars";

  var charPlugin = createPlugin(
    /* by= */
    CHARS,
    /* depends= */
    [WORDS],
    /* key= */
    "char",
    /* split= */
    function (el, options, ctx) {
      var results = [];

      each(ctx[WORDS], function (word, i) {
        results.push.apply(results, splitText(word, "char", "", options.whitespace && i));
      });

      return results;
    }
  );

  /**
   * # Splitting
   * 
   * @param {import('./types').ISplittingOptions} opts
   * @return {!Array<*>}
   */
  function Splitting(opts) {
    opts = opts || {};
    var key = opts.key;

    return $(opts.target || '[data-splitting]').map(function (el) {
      var ctx = el['🍌'];
      if (!opts.force && ctx) {
        return ctx;
      }

      ctx = el['🍌'] = {
        el: el
      };
      var by = opts.by || getData(el, 'splitting');
      if (!by || by == 'true') {
        by = CHARS;
      }
      var items = resolve(by);
      var opts2 = copy({}, opts);
      each(items, function (plugin) {
        if (plugin.split) {
          var pluginBy = plugin.by;
          var key2 = (key ? '-' + key : '') + plugin.key;
          var results = plugin.split(el, opts2, ctx);
          key2 && index(el, key2, results);
          ctx[pluginBy] = results;
          el.classList.add(pluginBy);
        }
      });

      el.classList.add('splitting');
      return ctx;
    })
  }

  /**
   * # Splitting.html
   * 
   * @param {import('./types').ISplittingOptions} opts
   */
  function html(opts) {
    opts = opts || {};
    var parent = opts.target = createElement();
    parent.innerHTML = opts.content;
    Splitting(opts);
    return parent.outerHTML
  }

  Splitting.html = html;
  Splitting.add = add;

  /**
   * Detects the grid by measuring which elements align to a side of it.
   * @param {!HTMLElement} el 
   * @param {import('../core/types').ISplittingOptions} options
   * @param {*} side 
   */
  function detectGrid(el, options, side) {
    var items = $(options.matching || el.children, el);
    var c = {};

    each(items, function (w) {
      var val = Math.round(w[side]);
      (c[val] || (c[val] = [])).push(w);
    });

    return Object.keys(c).map(Number).sort(byNumber).map(selectFrom(c));
  }

  /**
   * Sorting function for numbers.
   * @param {number} a 
   * @param {number} b
   * @return {number} 
   */
  function byNumber(a, b) {
    return a - b;
  }

  var linePlugin = createPlugin(
    /* by= */
    'lines',
    /* depends= */
    [WORDS],
    /* key= */
    'line',
    /* split= */
    function (el, options, ctx) {
      return detectGrid(el, {
        matching: ctx[WORDS]
      }, 'offsetTop')
    }
  );

  var itemPlugin = createPlugin(
    /* by= */
    'items',
    /* depends= */
    _,
    /* key= */
    'item',
    /* split= */
    function (el, options) {
      return $(options.matching || el.children, el)
    }
  );

  var rowPlugin = createPlugin(
    /* by= */
    'rows',
    /* depends= */
    _,
    /* key= */
    'row',
    /* split= */
    function (el, options) {
      return detectGrid(el, options, "offsetTop");
    }
  );

  var columnPlugin = createPlugin(
    /* by= */
    'cols',
    /* depends= */
    _,
    /* key= */
    "col",
    /* split= */
    function (el, options) {
      return detectGrid(el, options, "offsetLeft");
    }
  );

  var gridPlugin = createPlugin(
    /* by= */
    'grid',
    /* depends= */
    ['rows', 'cols']
  );

  var LAYOUT = "layout";

  var layoutPlugin = createPlugin(
    /* by= */
    LAYOUT,
    /* depends= */
    _,
    /* key= */
    _,
    /* split= */
    function (el, opts) {
      // detect and set options
      var rows = opts.rows = +(opts.rows || getData(el, 'rows') || 1);
      var columns = opts.columns = +(opts.columns || getData(el, 'columns') || 1);

      // Seek out the first <img> if the value is true 
      opts.image = opts.image || getData(el, 'image') || el.currentSrc || el.src;
      if (opts.image) {
        var img = $("img", el)[0];
        opts.image = img && (img.currentSrc || img.src);
      }

      // add optional image to background
      if (opts.image) {
        setProperty(el, "background-image", "url(" + opts.image + ")");
      }

      var totalCells = rows * columns;
      var elements = [];

      var container = createElement(_, "cell-grid");
      while (totalCells--) {
        // Create a span
        var cell = createElement(container, "cell");
        createElement(cell, "cell-inner");
        elements.push(cell);
      }

      // Append elements back into the parent
      appendChild(el, container);

      return elements;
    }
  );

  var cellRowPlugin = createPlugin(
    /* by= */
    "cellRows",
    /* depends= */
    [LAYOUT],
    /* key= */
    "row",
    /* split= */
    function (el, opts, ctx) {
      var rowCount = opts.rows;
      var result = Array2D(rowCount);

      each(ctx[LAYOUT], function (cell, i, src) {
        result[Math.floor(i / (src.length / rowCount))].push(cell);
      });

      return result;
    }
  );

  var cellColumnPlugin = createPlugin(
    /* by= */
    "cellColumns",
    /* depends= */
    [LAYOUT],
    /* key= */
    "col",
    /* split= */
    function (el, opts, ctx) {
      var columnCount = opts.columns;
      var result = Array2D(columnCount);

      each(ctx[LAYOUT], function (cell, i) {
        result[i % columnCount].push(cell);
      });

      return result;
    }
  );

  var cellPlugin = createPlugin(
    /* by= */
    "cells",
    /* depends= */
    ['cellRows', 'cellColumns'],
    /* key= */
    "cell",
    /* split= */
    function (el, opt, ctx) {
      // re-index the layout as the cells
      return ctx[LAYOUT];
    }
  );

  // install plugins
  // word/char plugins
  add(wordPlugin);
  add(charPlugin);
  add(linePlugin);
  // grid plugins
  add(itemPlugin);
  add(rowPlugin);
  add(columnPlugin);
  add(gridPlugin);
  // cell-layout plugins
  add(layoutPlugin);
  add(cellRowPlugin);
  add(cellColumnPlugin);
  add(cellPlugin);

  return Splitting;

})));
/*
 * jQuery In Viewport plugin
 */
;
(function ($, $win) {
  'use strict';

  var ScrollDetector = (function () {
    var data = {};

    return {
      init: function () {
        var self = this;

        this.addHolder('win', $win);

        $win.on('load.blockInViewport resize.blockInViewport orientationchange.blockInViewport', function () {
          $.each(data, function (holderKey, holderData) {
            self.calcHolderSize(holderData);

            $.each(holderData.items, function (itemKey, itemData) {
              self.calcItemSize(itemKey, itemData);
            });
          });
        });
      },

      addHolder: function (holderKey, $holder) {
        var self = this;
        var holderData = {
          holder: $holder,
          items: {},
          props: {
            height: 0,
            scroll: 0
          }
        };

        data[holderKey] = holderData;

        $holder.on('scroll.blockInViewport', function () {
          self.calcHolderScroll(holderData);

          $.each(holderData.items, function (itemKey, itemData) {
            self.calcItemScroll(itemKey, itemData);
          });
        });

        this.calcHolderSize(data[holderKey]);
      },

      calcHolderSize: function (holderData) {
        var holderOffset = window.self !== holderData.holder[0] ? holderData.holder.offset() : 0;

        holderData.props.height = holderData.holder.get(0) === window ? (window.innerHeight || document.documentElement.clientHeight) : holderData.holder.outerHeight();
        holderData.props.offset = holderOffset ? holderOffset.top : 0;

        this.calcHolderScroll(holderData);
      },

      calcItemSize: function (itemKey, itemData) {
        itemData.offset = itemData.$el.offset().top - itemData.holderProps.props.offset;
        itemData.height = itemData.$el.outerHeight();

        this.calcItemScroll(itemKey, itemData);
      },

      calcHolderScroll: function (holderData) {
        holderData.props.scroll = holderData.holder.scrollTop();
      },

      calcItemScroll: function (itemKey, itemData) {
        var itemInViewPortFromUp;
        var itemInViewPortFromDown;
        var itemOutViewPort;
        var holderProps = itemData.holderProps.props;

        switch (itemData.options.visibleMode) {
          case 1:
            itemInViewPortFromDown = itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height < holderProps.scroll + holderProps.height;
            itemInViewPortFromUp = itemData.offset > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2;
            break;

          case 2:
            itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height / 2 < holderProps.scroll + holderProps.height);
            itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height / 2 > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
            break;

          case 3:
            itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset < holderProps.scroll + holderProps.height);
            itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
            break;

          default:
            itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + Math.min(itemData.options.visibleMode, itemData.height) < holderProps.scroll + holderProps.height);
            itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height - Math.min(itemData.options.visibleMode, itemData.height) > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
            break;
        }


        if (itemInViewPortFromUp && itemInViewPortFromDown) {
          if (!itemData.state) {
            itemData.state = true;
            itemData.$el.addClass(itemData.options.activeClass)
              .trigger('in-viewport', true);

            if (itemData.options.once || ($.isFunction(itemData.options.onShow) && itemData.options.onShow(itemData))) {
              delete itemData.holderProps.items[itemKey];
            }
          }
        } else {
          itemOutViewPort = itemData.offset < holderProps.scroll + holderProps.height && itemData.offset + itemData.height > holderProps.scroll;

          if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
            itemData.state = false;
            itemData.$el.removeClass(itemData.options.activeClass)
              .trigger('in-viewport', false);
          }
        }
      },

      addItem: function (el, options) {
        var itemKey = 'item' + this.getRandomValue();
        var newItem = {
          $el: $(el),
          options: options
        };
        var holderKeyDataName = 'in-viewport-holder';

        var $holder = newItem.$el.closest(options.holder);
        var holderKey = $holder.data(holderKeyDataName);

        if (!$holder.length) {
          holderKey = 'win';
        } else if (!holderKey) {
          holderKey = 'holder' + this.getRandomValue();
          $holder.data(holderKeyDataName, holderKey);

          this.addHolder(holderKey, $holder);
        }

        newItem.holderProps = data[holderKey];

        data[holderKey].items[itemKey] = newItem;

        this.calcItemSize(itemKey, newItem);
      },

      getRandomValue: function () {
        return (Math.random() * 100000).toFixed(0);
      },

      destroy: function () {
        $win.off('.blockInViewport');

        $.each(data, function (key, value) {
          value.holder.off('.blockInViewport');

          $.each(value.items, function (key, value) {
            value.$el.removeClass(value.options.activeClass);
            value.$el.get(0).itemInViewportAdded = null;
          });
        });

        data = {};
      }
    };
  }());

  ScrollDetector.init();

  $.fn.itemInViewport = function (options) {
    options = $.extend({
      activeClass: 'in-viewport',
      once: true,
      holder: '',
      visibleMode: 1 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
    }, options);

    return this.each(function () {
      if (this.itemInViewportAdded) {
        return;
      }

      this.itemInViewportAdded = true;

      ScrollDetector.addItem(this, options);
    });
  };
}(jQuery, jQuery(window)));