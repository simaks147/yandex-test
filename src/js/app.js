import '../scss/app.scss';

import './stopTransitionWhenResize.js';
import scroll from './scroll.js';
import carousel from './carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  scroll('common-link', 'common');
  scroll('stages-link', 'stages');

  carousel('.stages__content');
  carousel('.members__content', {
    infinite: true,
    autoplay: true,
    numberCounter: true,
  });
});
