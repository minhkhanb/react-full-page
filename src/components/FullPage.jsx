import PropTypes from 'prop-types';
import React from 'react';
import animatedScrollTo from '../utils/animated-scroll-to';
import isMobileDevice from '../utils/is-mobile';
import { getObjectValues } from '../utils/helpers';
import Slide from './Slide';
import Controls from './Controls';

const scrollMode = {
  FULL_PAGE: 'full-page',
  NORMAL: 'normal',
};

export default class FullPage extends React.Component {
  static getChildrenCount = (children) => {
    const childrenArr = React.Children.toArray(children);
    const slides = childrenArr.filter(({ type }) => type === Slide);
    return slides.length;
  }

  constructor(props) {
    super(props);

    this._isScrollPending = false;
    this._isScrolledAlready = false;
    this._slides = [];
    this._touchSensitivity = 5;
    this._touchStart = 0;
    this._isMobile = null;
    this.mainContainerRef = React.createRef();

    this.state = {
      activeSlide: props.initialSlide,
      slidesCount: FullPage.getChildrenCount(this.props.children),
    };
  }

  componentDidMount() {
    this._isMobile = isMobileDevice();
    if (this._isMobile) {
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchstart', this.onTouchStart);
      document.addEventListener('touchend', this.onTouchEnd);
    } else {
      document.addEventListener('wheel', this.onScroll, { passive: false });
    }
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', () => {
      // Generate a resize event if the device doesn't do it
      this.onResize();
      this.scrollToSlide(this.props.initialSlide);
    }, false);

    this.onResize();
    this.scrollToSlide(this.props.initialSlide);
  }

  componentDidUpdate() {
    const newSlidesCount = FullPage.getChildrenCount(this.props.children);
    if (newSlidesCount !== this.state.slidesCount) {
      // use getDerivedStateFromProps after react <16 support is dropped
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        slidesCount: newSlidesCount,
      }, this.updateSlides);

      const slidesDiff = this.state.slidesCount - newSlidesCount;

      // activeSlide should always be less than slides count
      if (slidesDiff > 0 && this.state.activeSlide >= this.state.slidesCount - slidesDiff) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          activeSlide: newSlidesCount - 1,
        }, this.updateSlides);
      }
    }
  }

  componentWillUnmount() {
    if (this._isMobile) {
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchstart', this.onTouchStart);
      document.removeEventListener('touchend', this.onTouchEnd);
    } else {
      document.removeEventListener('wheel', this.onScroll);
    }
    window.removeEventListener('resize', this.onResize);
  }

  updateSlides = () => {
    this._slides = [];

    for (let i = 0; i < this.state.slidesCount; i++) {
      this._slides.push(window.innerHeight * i);
    }
  }

  onResize = () => {
    this.updateSlides();
    this.setState({
      height: window.innerHeight,
    });
  }

  onTouchStart = (evt) => {
    this._touchStart = evt.touches[0].clientY;
    this._touchStartX = evt.touches[0].clientX;
    this._isScrolledAlready = false;
    // this.xFrom = window.scrollY || window.pageYOffset || 0;
    this.container = this.mainContainerRef.current.closest('.fixed-fullpage');

    this.xFrom = this.container ? this.container.scrollTop : 0;
  }

  isVerticalScrollIntent = (changedTouches) => {
    const diffX = Math.abs(this._touchStartX - changedTouches.clientX);
    const diffY = Math.abs(this._touchStart - changedTouches.clientY);

    return diffY - this.props.touchSensitivity > 0 && diffY >= diffX;
  }

  isScrollHappensInMainContainer = (element) => {
    let el = element;
    while (el) {
      if (el === this.mainContainerRef.current) {
        return true;
      }
      el = el.parentElement;
    }

    return false;
  }

  onTouchMove = (evt) => {
    if (this.props.scrollMode !== scrollMode.FULL_PAGE
      || !this.isScrollHappensInMainContainer(evt.target)) {
      return;
    }

    if (!this.isVerticalScrollIntent(evt.changedTouches[0])) {
      evt.preventDefault();
      return;
    }

    const touchEnd = evt.changedTouches[0].clientY;
    const { touchSensitivity } = this.props;

    if (this._touchStart > touchEnd + touchSensitivity
      || this._touchStart < touchEnd - touchSensitivity) {
      evt.preventDefault();
      return;
    }

    let childHasVerticalScroll = false;
    let element = evt.target;

    // eslint-disable-next-line no-restricted-syntax
    while (element) {
      if (element === this.mainContainerRef.current) {
        break;
      } else {
        if (element !== document) {
          const slider = element.closest('ul.splide__list');
          const modal = element.closest('.modal');

          // const $ = document.querySelector.bind(document);
          // const trending = $('#trending');
          // const follow = $('#following');
          const isNotBackgroundVideo = false; // trending || follow;

          if (slider && isNotBackgroundVideo) {
            const transformStyle = window.getComputedStyle(slider).transform;
            const matrix = new DOMMatrixReadOnly(transformStyle);

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

        const overFlowY = window.getComputedStyle(element)['overflow-y'];
        if ((overFlowY === 'auto' || overFlowY === 'scroll') && element.scrollHeight > element.clientHeight) {
          if ((this._touchStart > touchEnd + touchSensitivity
              && element.scrollHeight > (element.scrollTop + element.clientHeight))
                 || (this._touchStart < touchEnd - touchSensitivity && element.scrollTop > 0)

          ) {
            childHasVerticalScroll = true;
            break;
          }
        }
      }
      element = element.parentElement;
    }

    if (!childHasVerticalScroll) {
      // evt.preventDefault();

      if (!this._isScrollPending && !this._isScrolledAlready) {
        if (this._touchStart > touchEnd + touchSensitivity) {
          // this.scrollToSlide(this.state.activeSlide + 1);
        } else if (this._touchStart < touchEnd - touchSensitivity) {
          // this.scrollToSlide(this.state.activeSlide - 1);
        }
      }
    }
  }

  onTouchEnd = (evt) => {
    // const fixedFullpage = $('.fixed-fullpage');
    // const fixedscrollY = fixedFullpage.scrollTop || 0;

    if (!this._isScrollPending && !this._isScrolledAlready) {
      const touchEnd = evt.changedTouches[0].clientY;

      // const scrollDiff = fixedscrollY - this.xFrom;

      if (touchEnd - this._touchStart > 0 && touchEnd - this._touchStart > 100) {
        this.scrollToSlide(this.state.activeSlide - 1);
      } else if (touchEnd - this._touchStart < 0 && Math.abs(-touchEnd + this._touchStart) > 100) {
        if (this.state.activeSlide >= this._slides.length - 1) {
          evt.preventDefault();
          evt.stopPropagation();
          return;
        }
        this.scrollToSlide(this.state.activeSlide + 1);
      } else {
        this.scrollToSlide(this.state.activeSlide);
      }

      // if (scrollDiff > 0 && scrollDiff > window.innerHeight / 2) {
      //   this.scrollToSlide(this.state.activeSlide + 1);
      // } else if (scrollDiff < 0 && Math.abs(scrollDiff) > window.innerHeight / 2) {
      //   this.scrollToSlide(this.state.activeSlide - 1);
      // } else {
      //   this.scrollToSlide(this.state.activeSlide);
      // }
    }
  }

  onScroll = (evt) => {
    if (this.props.scrollMode !== scrollMode.FULL_PAGE) {
      return;
    }

    evt.preventDefault();
    if (this._isScrollPending) {
      return;
    }

    const scrollDown = (evt.wheelDelta || -evt.deltaY || -evt.detail) < 0;
    let { activeSlide } = this.state;

    if (scrollDown) {
      activeSlide++;
    } else {
      activeSlide--;
    }

    this.scrollToSlide(activeSlide);
  }

  getSlidesCount = () => this.state.slidesCount

  getCurrentSlideIndex = () => this.state.activeSlide

  scrollNext = () => {
    this.scrollToSlide(this.state.activeSlide + 1);
  }

  scrollPrev = () => {
    this.scrollToSlide(this.state.activeSlide - 1);
  }

  scrollToSlide = (slide) => {
    if (!this._isScrollPending && slide >= 0 && slide < this.state.slidesCount) {
      const currentSlide = this.state.activeSlide;
      this.props.beforeChange({ from: currentSlide, to: slide });

      this.setState({
        activeSlide: slide,
      });

      this._isScrollPending = true;
      animatedScrollTo(this.container, this._slides[slide], this.props.duration, () => {
        this._isScrollPending = false;
        this._isScrolledAlready = true;

        this.props.afterChange({ from: currentSlide, to: slide });
      });
    }
  }

  renderControls() {
    const { controls, controlsProps } = this.props;
    if (!controls) {
      return null;
    }

    const controlsBasicProps = {
      getCurrentSlideIndex: this.getCurrentSlideIndex,
      onNext: this.scrollNext,
      onPrev: this.scrollPrev,
      scrollToSlide: this.scrollToSlide,
      slidesCount: this.getSlidesCount(),
    };

    if (controls === true) {
      return (
        <Controls
          className="full-page-controls"
          {...controlsBasicProps}
          {...controlsProps}
        />
      );
    }

    const CustomControls = controls;
    return (
      <CustomControls {...controlsBasicProps} {...controlsProps} />
    );
  }

  render() {
    return (
      <div ref={this.mainContainerRef} style={{ height: this.state.height }}>
        {this.renderControls()}
        {this.props.children}
      </div>
    );
  }
}

FullPage.propTypes = {
  afterChange: PropTypes.func,
  beforeChange: PropTypes.func,
  children: PropTypes.node.isRequired,
  controls: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
    PropTypes.func,
  ]),
  controlsProps: PropTypes.object,
  duration: PropTypes.number,
  initialSlide: PropTypes.number,
  scrollMode: PropTypes.oneOf(getObjectValues(scrollMode)),
  touchSensitivity: PropTypes.number,
};

FullPage.defaultProps = {
  afterChange: () => {},
  beforeChange: () => {},
  controls: false,
  controlsProps: {},
  duration: 700,
  initialSlide: 0,
  scrollMode: scrollMode.FULL_PAGE,
  touchSensitivity: 5,
};
