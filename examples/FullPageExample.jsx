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

const Div = () => (
  <div style={{
    width: 400, height: 200, overflow: 'scroll', background: 'green',
  }}
  >
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
      Ipsum has been the industry
      standard dummy text ever since the 1500s, when an unknown printer took a galley of
      type and scrambled it to make a type specimen book. It has survived not
      only five centuries, but also the leap into electronic typesetting, remaining
      essentially unchanged. It was popularised in the 1960s with the release of Letraset
      sheets containing Lorem Ipsum passages, and more recently with desktop
      publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Why do we use it?
      It is a long established fact that a reader will be
      distracted by the readable content of a page when looking at its layout. The point of
      using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed
      to using Content here, content here, making it look like readable English.
      Many desktop publishing
      packages and web page editors now use Lorem Ipsum as their default model text, and
      a search for lorem ipsum
      will uncover many web sites still in their infancy. Various versions have
      evolved over the years, sometimes
      by accident, sometimes on purpose (injected humour and the like).

      Where does it come from?
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
      in a piece of classical Latin literature from 45 BC, making it over 2000 years
      old. Richard McClintock,
      a Latin professor at Hampden-Sydney College in Virginia, looked up one of the
      more obscure Latin words,
      consectetur, from a Lorem Ipsum passage, and going through the cites of the
      word in classical literature,
      discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
      1.10.33 of de Finibus Bonorum
      et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This
      book is a treatise
      on the theory of ethics, very popular during the Renaissance. The first line
      of Lorem Ipsum, Lorem
      ipsum dolor sit amet.., comes from a line in section 1.10.32.
    </p>
  </div>
);

const slides = [
  {
    color: '#2ECC40',
    content: <Slider />,
  }, {
    color: '#0074D9',
    content: <Div />,
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
