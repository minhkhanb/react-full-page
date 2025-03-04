"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

require("core-js/modules/es.reflect.construct.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.get-prototype-of.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.filter.js");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _animatedScrollTo = _interopRequireDefault(require("../utils/animated-scroll-to"));

var _isMobile = _interopRequireDefault(require("../utils/is-mobile"));

var _helpers = require("../utils/helpers");

var _Slide = _interopRequireDefault(require("./Slide"));

var _Controls = _interopRequireDefault(require("./Controls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var scrollMode = {
  FULL_PAGE: 'full-page',
  NORMAL: 'normal'
};

var FullPage = /*#__PURE__*/function (_React$Component) {
  _inherits(FullPage, _React$Component);

  var _super = _createSuper(FullPage);

  function FullPage(props) {
    var _this;

    _classCallCheck(this, FullPage);

    _this = _super.call(this, props);

    _this.updateSlides = function () {
      _this._slides = [];

      for (var i = 0; i < _this.state.slidesCount; i++) {
        _this._slides.push(window.innerHeight * i);
      }
    };

    _this.onResize = function () {
      _this.updateSlides();

      _this.setState({
        height: window.innerHeight
      });
    };

    _this.onTouchStart = function (evt) {
      _this._touchStart = evt.touches[0].clientY;
      _this._touchStartX = evt.touches[0].clientX;
      _this._isScrolledAlready = false; // this.xFrom = window.scrollY || window.pageYOffset || 0;

      _this.container = _this.mainContainerRef.current.closest('.fixed-fullpage');
      _this.xFrom = _this.container ? _this.container.scrollTop : 0;
    };

    _this.isVerticalScrollIntent = function (changedTouches) {
      var diffX = Math.abs(_this._touchStartX - changedTouches.clientX);
      var diffY = Math.abs(_this._touchStart - changedTouches.clientY);
      return diffY - _this.props.touchSensitivity > 0 && diffY >= diffX;
    };

    _this.isScrollHappensInMainContainer = function (element) {
      var el = element;

      while (el) {
        if (el === _this.mainContainerRef.current) {
          return true;
        }

        el = el.parentElement;
      }

      return false;
    };

    _this.onTouchMove = function (evt) {
      if (_this.props.scrollMode !== scrollMode.FULL_PAGE || !_this.isScrollHappensInMainContainer(evt.target)) {
        return;
      }

      if (!_this.isVerticalScrollIntent(evt.changedTouches[0])) {
        evt.preventDefault();
        return;
      }

      var touchEnd = evt.changedTouches[0].clientY;
      var touchSensitivity = _this.props.touchSensitivity;

      if (_this._touchStart > touchEnd + touchSensitivity || _this._touchStart < touchEnd - touchSensitivity) {
        evt.preventDefault();
        return;
      }

      var childHasVerticalScroll = false;
      var element = evt.target; // eslint-disable-next-line no-restricted-syntax

      while (element) {
        if (element === _this.mainContainerRef.current) {
          break;
        } else {
          if (element !== document) {
            var slider = element.closest('ul.splide__list');
            var modal = element.closest('.modal'); // const $ = document.querySelector.bind(document);
            // const trending = $('#trending');
            // const follow = $('#following');

            var isNotBackgroundVideo = false; // trending || follow;

            if (slider && isNotBackgroundVideo) {
              var transformStyle = window.getComputedStyle(slider).transform;
              var matrix = new DOMMatrixReadOnly(transformStyle);

              if (matrix.m41 !== 0) {
                childHasVerticalScroll = true;
                break;
              }
            }

            if (modal) {
              childHasVerticalScroll = true;
              break;
            }
          }

          var overFlowY = window.getComputedStyle(element)['overflow-y'];

          if ((overFlowY === 'auto' || overFlowY === 'scroll') && element.scrollHeight > element.clientHeight) {
            if (_this._touchStart > touchEnd + touchSensitivity && element.scrollHeight > element.scrollTop + element.clientHeight || _this._touchStart < touchEnd - touchSensitivity && element.scrollTop > 0) {
              childHasVerticalScroll = true;
              break;
            }
          }
        }

        element = element.parentElement;
      }

      if (!childHasVerticalScroll) {
        // evt.preventDefault();
        if (!_this._isScrollPending && !_this._isScrolledAlready) {
          if (_this._touchStart > touchEnd + touchSensitivity) {// this.scrollToSlide(this.state.activeSlide + 1);
          } else if (_this._touchStart < touchEnd - touchSensitivity) {// this.scrollToSlide(this.state.activeSlide - 1);
          }
        }
      }
    };

    _this.onTouchEnd = function (evt) {
      // const fixedFullpage = $('.fixed-fullpage');
      // const fixedscrollY = fixedFullpage.scrollTop || 0;
      if (!_this._isScrollPending && !_this._isScrolledAlready) {
        var touchEnd = evt.changedTouches[0].clientY; // const scrollDiff = fixedscrollY - this.xFrom;

        if (touchEnd - _this._touchStart > 0 && touchEnd - _this._touchStart > 100) {
          _this.scrollToSlide(_this.state.activeSlide - 1);
        } else if (touchEnd - _this._touchStart < 0 && Math.abs(-touchEnd + _this._touchStart) > 100) {
          if (_this.state.activeSlide >= _this._slides.length - 1) {
            evt.preventDefault();
            evt.stopPropagation();
            return;
          }

          _this.scrollToSlide(_this.state.activeSlide + 1);
        } else {
          _this.scrollToSlide(_this.state.activeSlide);
        } // if (scrollDiff > 0 && scrollDiff > window.innerHeight / 2) {
        //   this.scrollToSlide(this.state.activeSlide + 1);
        // } else if (scrollDiff < 0 && Math.abs(scrollDiff) > window.innerHeight / 2) {
        //   this.scrollToSlide(this.state.activeSlide - 1);
        // } else {
        //   this.scrollToSlide(this.state.activeSlide);
        // }

      }
    };

    _this.onScroll = function (evt) {
      if (_this.props.scrollMode !== scrollMode.FULL_PAGE) {
        return;
      }

      evt.preventDefault();

      if (_this._isScrollPending) {
        return;
      }

      var scrollDown = (evt.wheelDelta || -evt.deltaY || -evt.detail) < 0;
      var activeSlide = _this.state.activeSlide;

      if (scrollDown) {
        activeSlide++;
      } else {
        activeSlide--;
      }

      _this.scrollToSlide(activeSlide);
    };

    _this.getSlidesCount = function () {
      return _this.state.slidesCount;
    };

    _this.getCurrentSlideIndex = function () {
      return _this.state.activeSlide;
    };

    _this.scrollNext = function () {
      _this.scrollToSlide(_this.state.activeSlide + 1);
    };

    _this.scrollPrev = function () {
      _this.scrollToSlide(_this.state.activeSlide - 1);
    };

    _this.scrollToSlide = function (slide) {
      if (!_this._isScrollPending && slide >= 0 && slide < _this.state.slidesCount) {
        var currentSlide = _this.state.activeSlide;

        _this.props.beforeChange({
          from: currentSlide,
          to: slide
        });

        _this.setState({
          activeSlide: slide
        });

        _this._isScrollPending = true;
        (0, _animatedScrollTo.default)(_this.container, _this._slides[slide], _this.props.duration, function () {
          _this._isScrollPending = false;
          _this._isScrolledAlready = true;

          _this.props.afterChange({
            from: currentSlide,
            to: slide
          });
        });
      }
    };

    _this._isScrollPending = false;
    _this._isScrolledAlready = false;
    _this._slides = [];
    _this._touchSensitivity = 5;
    _this._touchStart = 0;
    _this._isMobile = null;
    _this.mainContainerRef = /*#__PURE__*/_react.default.createRef();
    _this.state = {
      activeSlide: props.initialSlide,
      slidesCount: FullPage.getChildrenCount(_this.props.children)
    };
    return _this;
  }

  _createClass(FullPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this._isMobile = (0, _isMobile.default)();

      if (this._isMobile) {
        document.addEventListener('touchmove', this.onTouchMove, {
          passive: false
        });
        document.addEventListener('touchstart', this.onTouchStart);
        document.addEventListener('touchend', this.onTouchEnd);
      } else {
        document.addEventListener('wheel', this.onScroll, {
          passive: false
        });
      }

      window.addEventListener('resize', this.onResize);
      window.addEventListener('orientationchange', function () {
        // Generate a resize event if the device doesn't do it
        _this2.onResize();

        _this2.scrollToSlide(_this2.props.initialSlide);
      }, false);
      this.onResize();
      this.scrollToSlide(this.props.initialSlide);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var newSlidesCount = FullPage.getChildrenCount(this.props.children);

      if (newSlidesCount !== this.state.slidesCount) {
        // use getDerivedStateFromProps after react <16 support is dropped
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          slidesCount: newSlidesCount
        }, this.updateSlides);
        var slidesDiff = this.state.slidesCount - newSlidesCount; // activeSlide should always be less than slides count

        if (slidesDiff > 0 && this.state.activeSlide >= this.state.slidesCount - slidesDiff) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            activeSlide: newSlidesCount - 1
          }, this.updateSlides);
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._isMobile) {
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchend', this.onTouchEnd);
      } else {
        document.removeEventListener('wheel', this.onScroll);
      }

      window.removeEventListener('resize', this.onResize);
    }
  }, {
    key: "renderControls",
    value: function renderControls() {
      var _this$props = this.props,
          controls = _this$props.controls,
          controlsProps = _this$props.controlsProps;

      if (!controls) {
        return null;
      }

      var controlsBasicProps = {
        getCurrentSlideIndex: this.getCurrentSlideIndex,
        onNext: this.scrollNext,
        onPrev: this.scrollPrev,
        scrollToSlide: this.scrollToSlide,
        slidesCount: this.getSlidesCount()
      };

      if (controls === true) {
        return /*#__PURE__*/_react.default.createElement(_Controls.default, _extends({
          className: "full-page-controls"
        }, controlsBasicProps, controlsProps));
      }

      var CustomControls = controls;
      return /*#__PURE__*/_react.default.createElement(CustomControls, _extends({}, controlsBasicProps, controlsProps));
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement("div", {
        ref: this.mainContainerRef,
        style: {
          height: this.state.height
        }
      }, this.renderControls(), this.props.children);
    }
  }]);

  return FullPage;
}(_react.default.Component);

exports.default = FullPage;

FullPage.getChildrenCount = function (children) {
  var childrenArr = _react.default.Children.toArray(children);

  var slides = childrenArr.filter(function (_ref) {
    var type = _ref.type;
    return type === _Slide.default;
  });
  return slides.length;
};

FullPage.propTypes = {
  afterChange: _propTypes.default.func,
  beforeChange: _propTypes.default.func,
  children: _propTypes.default.node.isRequired,
  controls: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.element, _propTypes.default.func]),
  controlsProps: _propTypes.default.object,
  duration: _propTypes.default.number,
  initialSlide: _propTypes.default.number,
  scrollMode: _propTypes.default.oneOf((0, _helpers.getObjectValues)(scrollMode)),
  touchSensitivity: _propTypes.default.number
};
FullPage.defaultProps = {
  afterChange: function afterChange() {},
  beforeChange: function beforeChange() {},
  controls: false,
  controlsProps: {},
  duration: 700,
  initialSlide: 0,
  scrollMode: scrollMode.FULL_PAGE,
  touchSensitivity: 5
};