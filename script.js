'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');

const nav = document.querySelector('.nav');
const navLogo = document.querySelector('.nav__logo');
const navLinks = document.querySelector('.nav__links');
const navMenu = document.querySelector('.nav__menu--list');

const imgTargets = document.querySelectorAll('img[data-src]');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const themeToggler = document.querySelector('.theme-toggler');

///THEME TOGGLER
//TOGGLETHEME MODES
const toggleTheme = function () {
  //Classes to toggle
  body.classList.toggle('light');
  modal.classList.toggle('light');
  document.querySelector('.fa-moon').classList.toggle('hidden');
  document.querySelector('.fa-sun').classList.toggle('hidden');
  document.querySelector('.operations').classList.toggle('light');
  document.querySelector('.fa-bars').classList.toggle('light');

  if (body.classList.contains('light')) {
    navLogo.setAttribute('src', 'img/logo.png');
  } else navLogo.setAttribute('src', 'img/logo-light.png');
};
themeToggler.addEventListener('click', toggleTheme);

document.querySelector('.fa-bars').addEventListener('click', function (e) {
  e.preventDefault();
  navMenu.classList.toggle('menu-hidden');
  overlay.classList.remove('hidden');
});

const closeMenu = function () {
  navMenu.classList.add('menu-hidden');
  overlay.classList.add('hidden');
};
document.querySelector('.fa-close').addEventListener('click', function (e) {
  e.preventDefault();
  closeMenu();
  overlay.classList.add('hidden');
});

/////////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  if (!navMenu.classList.contains('menu-hidden')) {
    overlay.classList.remove('hidden');
  }
};

//OPEN MODAL HANDLER FUNCTION
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

//CLOSE MODAL HANDLER FUNCTION
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', function (e) {
  if (!navMenu.classList.contains('.menu-hidden')) {
    closeMenu();
  }

  if (!modal.classList.contains('hidden')) {
    closeModal();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }

  if (e.key === 'Escape' && !navMenu.classList.contains('.menu-hidden')) {
    closeMenu();
    overlay.classList.add('hidden');
  }
});

//SCROLL TO SECTION 1 FUNCTION HANDLER
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  //SCrolling in Old Browsers
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //SCrolling in Modern Browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

//PAGE NAVIDATION WITH NAV LINKS
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//ACTIVATIONG THE TABBED COMPONENTS
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  //Remove Classes from tab and tabcontent
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Add classes to tab and tabcontent
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//MENU FADE IN AND OUT ACTIVATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('.nav__logo');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//API INTERSECTION OBSERVER FOR STICKY NAVBAR
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  const intersectingEntry = [entry];
  if (!entry.isIntersecting && !body.classList.contains('light')) {
    nav.classList.add('sticky');
    nav.classList.remove('sticky-light');
  } else {
    nav.classList.remove('sticky');
  }

  if (!entry.isIntersecting && body.classList.contains('light')) {
    nav.classList.add('sticky-light');
    nav.classList.remove('sticky');
  } else {
    nav.classList.remove('sticky-light');
  }
  return intersectingEntry;
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//API INTERSECTION OBSERVER FOR REVEAL SECTION
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//API INTERSECTION OBSERVER FOR LAZY LOADING IMAGES

const loadImages = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//SLIDER
const slider = document.querySelector('.slider');
const btnLeftSlider = document.querySelector('.slider__btn--left');
const btnRightSlider = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');
let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    const dotElement = `<button class="dots__dot" data-slide="${i}"></button>`;
    dotContainer.insertAdjacentHTML('beforeend', dotElement);
  });
};

createDots();

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDots(0);

const goToSlides = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlides(0);
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlides(curSlide);
  activateDots(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlides(curSlide);
  activateDots(curSlide);
};
btnRightSlider.addEventListener('click', nextSlide);
btnLeftSlider.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlides(slide);
    activateDots(slide);
  }
});
