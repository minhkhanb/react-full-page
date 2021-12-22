import easeInOutCubic from './ease-in-out-cubic';

export default function animatedScrollTo(container, scrollTo, duration, callback) {
  const scrollFrom = container.scrollTop || 0;
  // const scrollFrom = window.scrollY || window.pageYOffset || 0;
  const scrollDiff = scrollTo - scrollFrom;
  let currentTime = 0;
  const increment = 20;

  (function animateScroll() {
    currentTime += increment;
    const newScrollPos = easeInOutCubic(currentTime, scrollFrom, scrollDiff, duration);

    if (container) {
      container.scrollTo(0, newScrollPos);
    }

    if (currentTime > duration) {
      callback();
      return;
    }

    setTimeout(animateScroll, increment);
  }());
}
