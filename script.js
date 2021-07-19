'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  /* window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  ); */

  // Old Way
  /* window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation
/* document.querySelectorAll('.nav__link').forEach(function (ele) {
  ele.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); */

// Page Navigation with Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
	if(id === 'home.html') window.location.href = e.target.href;
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Componenets

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // Guard Clause
  if (!clicked) return;
  // Making all in-active
  tabs.forEach((t) => t.classList.remove('operations__tab--active'));
  // Active only selected
  clicked.classList.add('operations__tab--active');
  // Display content area
  tabsContent.forEach((tc) =>
    tc.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Componenets
const handleHover = function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation
// Old Way
/* const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}); */

//New Way (Intersection observer API)
// Practice with Intersection Observer
/* const observerCallback = function (entries, observer) {
  entries.forEach((entry) => console.log(entry));
};
const observerOptions = {
  root: null,
  treshold: [0, 0.2],
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe(section1); */

// implementation of sticky using Intersection Observer
const stickyNav = function (entries) {
  const [entry] = entries; // entries[0] only 1st entry
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Revealing section on scroll
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries; // entries[0] only 1st entry
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  treshold: 0.15,
});
allSection.forEach((section) => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy Loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries; // entries[0] only 1st entry
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  treshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach((img) => imgObserver.observe(img));

// Testimonial Slider
const sliderFunction = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // Creating Dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //Activate Dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // Selecting Dot
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activateDot(slide);
    }
  });
  // Goto slide
  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const init = function () {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  //Next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide) currentSlide = 0;
    else currentSlide++;
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };
  btnRight.addEventListener('click', nextSlide);

  // Previous Slide
  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide;
    else currentSlide--;
    gotoSlide(currentSlide);
    activateDot(currentSlide);
  };
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
};
sliderFunction();



