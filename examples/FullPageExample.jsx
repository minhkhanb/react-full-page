import React, { useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { FullPage, Slide } from '../src';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

const controlsProps = {
  style: {
    left: '50%',
    paddingTop: '10px',
    position: 'fixed',
    transform: 'translateX(-50%)',
  },
};

const Slider = () => (
  <Splide options={{ rewind: true }}>
    <SplideSlide>
      <h3>AAAAAAAA</h3>
    </SplideSlide>
    <SplideSlide>
      <h3>BBBBBBBB</h3>
    </SplideSlide>
  </Splide>
);

const slides = [
  {
    color: '#2ECC40',
    content: <Slider />,
  }, {
    color: '#0074D9',
    content: 2,
  }, {
    color: '#00c4ff',
    content: 3,
  }, {
    color: '#d52685',
    content: 4,
  },
];

const btnStyles = {
  position: 'fixed',
  padding: '8px',
};

export default function FullPageExample() {
  const [visibleSlides, setVisibleSlides] = useState(slides);
  const onHideSlideClick = () => {
    if (visibleSlides.length === slides.length) {
      setVisibleSlides(slides.slice(0, -1));
      return;
    }
    setVisibleSlides(slides);
  };

  return (
    <>
      <button
        onClick={onHideSlideClick}
        type="button"
        style={btnStyles}
      >
        toggle last slide
      </button>
      <FullPage controls controlsProps={controlsProps}>
        {visibleSlides.map(({ color, content }) => (
          <Slide
            key={content}
            style={{
              background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <h1>
              {content}
              1111
            </h1>
          </Slide>
        ))}
      </FullPage>
    </>
  );
}
