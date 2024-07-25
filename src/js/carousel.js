class Carousel {
  constructor(container, options) {
    this.options = {
      infinite: false,
      autoplay: false,
      numberCounter: false,
      ...options,
    };
    this.container = document.querySelector(container);
    this.items = this.container.children;
    this.itemsLength = this.items.length;
    this.itemsOrder = [];
    this.initiaItemlClassName = null;
    this.activeItemIndex = null;
    this.controlsNames = ['prev', 'counter', 'next'];
    this.indexEl = null;
    this.markerEls = null;
    this.prevEl = null;
    this.nextEl = null;
    this.preventPrev = false;
    this.preventNext = false;
  }

  mount() {
    const controls = document.createElement('div');

    this.container.classList.add('js-carousel-container');
    controls.classList.add('js-carousel-controls');

    this.initiaItemlClassName = this.items[0].className;

    [...this.items].forEach((item, index) => {
      item.classList.add('js-carousel-item', `js-carousel-item-${index + 1}`);
      item.setAttribute('data-index', index);
      this.container.append(item);

      this.itemsOrder.push(index + 1);
    });

    this.controlsNames.forEach((name) => {
      const controlEl = document.createElement('div');
      controlEl.classList.add(name);

      if (name === 'prev') {
        if (!this.options.infinite) controlEl.classList.add('disabled');
        controlEl.addEventListener('click', this.prev.bind(this));
        this.prevEl = controlEl;
      }
      if (name === 'next') {
        controlEl.addEventListener('click', this.next.bind(this));
        this.nextEl = controlEl;
      }

      if (name === 'counter') {
        if (this.options.numberCounter) {
          const indexEl = document.createElement('span');
          const countEl = document.createElement('span');

          indexEl.classList.add('index');
          countEl.classList.add('count');

          countEl.textContent = this.itemsLength;

          controlEl.append(indexEl, ' / ', countEl);

          this.indexEl = indexEl;
        } else {
          for (let i = 0; i < this.itemsLength; i += 1) {
            const markerEl = document.createElement('span');
            markerEl.classList.add('marker');

            controlEl.append(markerEl);
          }

          this.markerEls = controlEl;
        }
      }

      controls.append(controlEl);
    });

    this.container.after(controls);

    this.setActive();
  }

  calculateContainerHeight() {
    this.container.style.height = 'auto';

    const itemHeights = [...this.items].map((item) => item.getBoundingClientRect().height);

    this.container.style.height = `${Math.max(...itemHeights)}px`;
  }

  events() {
    window.addEventListener('resize', this.calculateContainerHeight.bind(this));
  }

  next() {
    if (this.preventNext) return;
    if (!this.options.infinite && !(this.activeItemIndex < this.itemsLength - 1)) return;

    this.preventNext = true;

    const firstItemClone = this.container.firstElementChild.cloneNode(true);
    firstItemClone.className = 'js-carousel-item js-carousel-item-first-copy';
    this.container.append(firstItemClone);
    this.itemsOrder.unshift('last-copy');

    this.itemsOrder.forEach((item, index) => {
      setTimeout(() => {
        try {
          [...this.items][index].className = `${this.initiaItemlClassName} js-carousel-item js-carousel-item-${item}`;
        } catch (error) {
          // continue regardless of error
        }
      }, 10);
    });

    setTimeout(() => {
      this.itemsOrder.shift('last-copy');
      this.container.firstElementChild.remove();

      this.setActive('next');

      if (!this.options.infinite) this.toggleButton('next');

      this.preventNext = false;
    }, 500);
  }

  prev() {
    if (this.preventPrev) return;
    if (!this.options.infinite && !(this.activeItemIndex > 0)) return;

    this.preventPrev = true;

    const lastItemClone = this.container.lastElementChild.cloneNode(true);
    lastItemClone.className = 'js-carousel-item js-carousel-item-last-copy';
    this.container.prepend(lastItemClone);
    this.itemsOrder.push('first-copy');

    this.itemsOrder.forEach((item, index) => {
      setTimeout(() => {
        try {
          [...this.items][index].className = `${this.initiaItemlClassName} js-carousel-item js-carousel-item-${item}`;
        } catch (error) {
          // continue regardless of error
        }
      }, 10);
    });

    setTimeout(() => {
      this.itemsOrder.pop('first-copy');
      this.container.lastElementChild.remove();

      this.setActive('prev');

      if (!this.options.infinite) this.toggleButton('prev');

      this.preventPrev = false;
    }, 500);
  }

  setActive(condition) {
    if (this.activeItemIndex !== null) {
      this.container.querySelector(`[data-index="${this.activeItemIndex}"]`).removeAttribute('data-active');

      if (!this.options.numberCounter) {
        [...this.markerEls.children][this.activeItemIndex].classList.remove('active');
      }

      if (condition === 'next') {
        if (this.activeItemIndex < this.itemsLength - 1) {
          this.activeItemIndex += 1;
        } else {
          this.activeItemIndex = 0;
        }
      }
      if (condition === 'prev') {
        if (this.activeItemIndex > 0) {
          this.activeItemIndex -= 1;
        } else {
          this.activeItemIndex = this.itemsLength - 1;
        }
      }
    } else {
      this.activeItemIndex = 0;
    }

    this.container.querySelector(`[data-index="${this.activeItemIndex}"]`).setAttribute('data-active', true);

    if (this.options.numberCounter) this.indexEl.textContent = this.activeItemIndex + 1;
    else {
      [...this.markerEls.children][this.activeItemIndex].classList.add('active');
    }
  }

  toggleButton(condition) {
    if (condition === 'next') {
      if (this.activeItemIndex === this.itemsLength - 1) this.nextEl.classList.add('disabled');
      if (this.prevEl.classList.contains('disabled')) this.prevEl.classList.remove('disabled');
    }
    if (condition === 'prev') {
      if (this.activeItemIndex === 0) this.prevEl.classList.add('disabled');
      if (this.nextEl.classList.contains('disabled')) this.nextEl.classList.remove('disabled');
    }
  }

  play() {
    setInterval(this.next.bind(this), 4000);
  }

  init() {
    if (this.itemsLength > 0) {
      this.mount();
      this.calculateContainerHeight();
      this.events();
      if (this.options.autoplay && this.options.infinite) this.play();
    }
  }
}

export default function carousel(el, options) {
  window.addEventListener('load', () => {
    new Carousel(el, options).init();
  });
}
