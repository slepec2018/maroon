const MOBILE_MAX_WIDTH = 767

const header = document.querySelector(`.header`)
const menu = document.querySelector(`.navigation`)
const button = document.querySelector(`.header__menu-button`)
const overlay = document.querySelector(`.navigation__overlay`)

// Polyfills

/* eslint-disable no-undef */
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this

    do {
      if (el.matches(s)) {
        return el
      }
      el = el.parentElement || el.parentNode
    } while (el !== null && el.nodeType === 1)
    return null
  }
}
/* eslint-disable no-undef */


function openHeaderMenu() {

  button.removeEventListener(`click`, openHeaderMenu)
  button.addEventListener(`click`, closeHeaderMenu)
  overlay.addEventListener(`click`, closeHeaderMenu)

  document.addEventListener(`keydown`, onEscPress)

  document.body.classList.add(`no-scroll`)
  header.classList.add(`header_colored`)
  menu.classList.add(`navigation_open`)
  button.classList.add(`header__menu-button_active`)

  setMenuHeight()
}

function closeHeaderMenu() {
  button.removeEventListener(`click`, closeHeaderMenu)
  button.addEventListener(`click`, openHeaderMenu)
  overlay.removeEventListener(`click`, closeHeaderMenu)

  document.removeEventListener(`keydown`, onEscPress)

  document.body.classList.remove(`no-scroll`)
  if (!isScrolled()) {
    header.classList.remove(`header_colored`)
  }
  menu.classList.remove(`navigation_open`)
  button.classList.remove(`header__menu-button_active`)
}

function onEscPress(evt) {
  if (evt.keyCode === 27) {
    closeHeaderMenu()
  }
}

function isScrolled() {
  const pxAmount = 0
  const scrollTop = document.documentElement.scrollTop

  return scrollTop > pxAmount
}

function setMenuHeight() {
  menu.removeAttribute(`style`)

  const deltaHeight = document.body.offsetHeight - header.offsetHeight
  const menuHeight = menu.offsetHeight

  if (deltaHeight < menuHeight) {
    menu.setAttribute(`style`, `height: ${deltaHeight}px`)
  }
}

if (menu) {
  window.addEventListener(`scroll`, function () {
    if (isScrolled()) {
      header.classList.add(`header_colored`)
    } else {
      header.classList.remove(`header_colored`)
    }
  })

  closeHeaderMenu()
}

const slider = document.querySelector(`.swiper-container`)

if (slider) {
  /* eslint-disable no-undef */
  const mySwiper = new Swiper(`.swiper-container`, {
    init: false,
    loop: true,
    navigation: {
      nextEl: `.slider__button_next`,
      prevEl: `.slider__button_prev`,
    },
    slidesPerView: 4,
    spaceBetween: 30,
    updateOnWindowResize: true,
    breakpoints: {
      320: {
        width: 970
      },
      768: {
        width: 1010
      }
    }
  })

  mySwiper.init()
  /* eslint-disable no-undef */
}


const map = document.getElementById(`map`)

if (map) {
  const mapCenter = map.dataset.center.split(`,`)
  const mapZoom = map.dataset.zoom
  const hintContent = map.dataset.hintContent
  const balloonContent = map.dataset.balloonContent

  /* eslint-disable no-undef */
  ymaps.ready(function () {
    const myMap = new ymaps.Map(
      `map`, {
        center: mapCenter,
        zoom: mapZoom
      }, {
        searchControlProvider: `yandex#search`
      }
    )

    const myPlacemark = new ymaps.Placemark(
      myMap.getCenter(), {
        hintContent,
        balloonContent
      }, {
        iconLayout: `default#image`,
        iconImageHref: `img/mark.svg`,
        iconImageSize: [16, 22],
        iconImageOffset: [0, 0]
      }
    )

    myMap.geoObjects.add(myPlacemark)
  })
  /* eslint-disable no-undef */
}


// Card

function toggleAccordion(element) {
  element.classList.toggle(`accordion_closed`)
  element.classList.toggle(`accordion_opened`)
}

function onAccorderonTogglerClick(evt) {
  const accordionElement = evt.currentTarget.closest(`.accordion`)
  toggleAccordion(accordionElement)
}

function initAccordion(element) {
  if (element.classList.contains(`accordion_inited`)) {
    return
  }

  const toggler = element.querySelector(`.accordion__toggler`)
  const content = element.querySelector(`.accordion__content`)

  toggler.addEventListener(`click`, onAccorderonTogglerClick)

  // We write in the style attribute the height of the content in expanded form
  content.style.height = `${content.scrollHeight}px`
  element.classList.add(`accordion_inited`)
  element.classList.add(`accordion_closed`)
}

function destroyAccordion(element) {
  if (!element.classList.contains(`accordion_inited`)) {
    return
  }

  const toggler = element.querySelector(`.accordion__toggler`)
  const content = element.querySelector(`.accordion__content`)

  toggler.removeEventListener(`click`, onAccorderonTogglerClick)

  // We write in the style attribute the height of the content in expanded form
  content.style.height = false
  element.classList.remove(`accordion_inited`)
  element.classList.remove(`accordion_closed`)
}

const cardAccordionElements = document.querySelectorAll(`.card__accordion`)

// Catalog filter

const catalogHeadElement = document.querySelector(`.catalog-head`)
const catalogBtnOpen = document.querySelector(`.catalog-head__button-open`)
const catalogBtnClose = document.querySelector(`.catalog-head__button-close`)

function onFilterOutsideClick(evt) {
  if (!catalogHeadElement.contains(evt.target)) {
    catalogHeadClose()
  }
}

function onEscKeydown(evt) {
  if (evt.keyCode === 27) {
    catalogHeadClose()
  }
}

function catalogHeadOpen() {
  catalogHeadElement.classList.remove(`catalog-head_filter-hidden`)
  document.addEventListener(`click`, onFilterOutsideClick)
  document.addEventListener(`keydown`, onEscKeydown)
}

function catalogHeadClose() {
  catalogHeadElement.classList.add(`catalog-head_filter-hidden`)
  document.removeEventListener(`click`, onFilterOutsideClick)
  document.removeEventListener(`keydown`, onEscKeydown)
}

function catalogHeadInit() {
  catalogHeadElement.classList.add(`catalog-head_filter-inited`)
  catalogHeadClose()
  catalogBtnOpen.addEventListener(`click`, catalogHeadOpen)
  catalogBtnClose.addEventListener(`click`, catalogHeadClose)
}

if (catalogHeadElement) {
  catalogHeadInit()
}

const filterAccordionElements = document.querySelectorAll(`.filter__block`)

function setMobileFilterAccordions() {
  if (window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches) {
    filterAccordionElements.forEach(function (element) {
      initAccordion(element)
    })
  } else {
    filterAccordionElements.forEach(function (element) {
      destroyAccordion(element)
    })
  }
}

window.addEventListener(`resize`, setMobileFilterAccordions)

cardAccordionElements.forEach(function (element) {
  initAccordion(element)
})

setMobileFilterAccordions()
