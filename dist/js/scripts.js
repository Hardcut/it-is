document.addEventListener("DOMContentLoaded", function() {

  //polyfills
  if (!Element.prototype.matches) {

    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }

  if (!Array.from) {
    Array.from = (function() {
      var toStr = Object.prototype.toString;
      var isCallable = function(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function(value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      return function from(arrayLike) {
        var C = this;
        var items = Object(arrayLike);

        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        var len = toLength(items.length);
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        var k = 0;
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        A.length = len;
        return A;
      };
    }());
  }

  if (!Element.prototype.closest) {

    Element.prototype.closest = function(css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }

  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('before')) {
        return;
      }
      Object.defineProperty(item, 'before', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function before() {
          var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();
          
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          
          this.parentNode.insertBefore(docFrag, this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  //preload
  let body = document.querySelector('body');
  body.classList.remove('preload');

  //lazy
  let lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  });

  const nav = document.querySelector('.header');
  const navTop = nav.offsetTop;

  window.addEventListener('scroll', stickyNavigation);

  //mob menu
  let html = document.querySelector('html');
  let btnMobMenu = document.querySelector('.btn-mob-menu');
  let headerMenu = document.querySelector('.header .main__menu__wrap')

  if (btnMobMenu) {
    btnMobMenu.addEventListener('click', function() {
      if (btnMobMenu.classList.contains('active')) {
        btnMobMenu.classList.remove('active');
        headerMenu.classList.remove('active');
        html.classList.remove('overflow-hidden');
      } else {
        btnMobMenu.classList.add('active');
        headerMenu.classList.add('active');
        html.classList.add('overflow-hidden');
      }
    });
  }

  //main menu submenu
  let mainMenuItems = Array.from(document.querySelectorAll('.main__menu__item'));

  if (mainMenuItems) {
    mainMenuItems.map(function(el) {
      if (document.body.clientWidth > 1199) {
        el.addEventListener('mouseenter', function() {
          el.classList.add('open');
        });
        el.addEventListener('mouseleave', function() {
          el.classList.remove('open');
        });
      } else {
        if (el.querySelector('.btn-unfold')) {
          el.querySelector('.btn-unfold').addEventListener('click', function() {
            if (el.classList.contains('open')) {
              el.classList.remove('open')
            } else {
              el.classList.add('open')
            }
          });
        }
      }
    });
  }

  //sliders
  let worksSlider = document.querySelector('.works__slider ');

  if (worksSlider) {
    worksSlider = new Swiper('.works__slider', {
      slidesPerView: 'auto',
      spaceBetween: 40,
      centeredSlides: true,
      loop: true,
      initialSlide: 1,
      watchOverflow: true,
      navigation: {
        nextEl: '.works__slider .swiper-button-next',
        prevEl: '.works__slider .swiper-button-prev',
      },
    });
  }

  //tabs
  let tabsSwitches = Array.from(document.querySelectorAll('.tabs__switch'));

  if (tabsSwitches) {
    tabsSwitches.map(function(tabsSwitch) {
      tabsSwitch.addEventListener('click', function() {

        tabsSwitch.closest('.tabs__wrap').querySelector('.tabs__switch.active').classList.remove('active');
        tabsSwitch.classList.add('active');
        showCurTab(tabsSwitch);
        if (document.body.clientWidth < 1200) {
          let anchor = tabsSwitch.closest('.tabs__wrap').querySelector('.tabs');
          makeScroll(anchor);
        }
      });
    });
  }

  //popups
  let overlay = document.querySelector('.overlay');
  let popupClose = Array.from(document.querySelectorAll('.popup__close'));
  let popups = Array.from(document.querySelectorAll('.popup'));
  let requestPopup = document.querySelector('.popup[data-popup="request"]');

  overlay.addEventListener('click', function() {
    overlay.classList.remove('active');
    html.classList.remove('overflow-hidden');

    if (requestPopup.classList.contains('active')) {
      setTimeout(function() {
        requestPopup.setAttribute('data-service', '');
      }, 400);
    }

    setTimeout(function() {
      overlay.style.display = 'none';
    }, 400);

    popups.map(function(el) {
      el.classList.remove('active');
      setTimeout(function() {
        el.style.display = 'none';
      }, 400);
    });
  });

  popupClose.map(function(el) {
    el.addEventListener('click', function() {
      html.classList.remove('overflow-hidden');
      overlay.classList.remove('active');

      if (requestPopup.classList.contains('active')) {
        setTimeout(function() {
          requestPopup.setAttribute('data-service', '');
        }, 400);
      }

      el.closest('.popup').classList.remove('active');
      setTimeout(function() {
        overlay.style.display = 'none';
        el.closest('.popup').style.display = 'none';
      }, 400);
    });
  });

  btnsGetPopup = Array.from(document.querySelectorAll('[data-get-popup]'));

  if (btnsGetPopup) {
    btnsGetPopup.map(function(el) {
      el.addEventListener('click', function() {
        let dataPopup = el.dataset.getPopup;

        if (el.hasAttribute("data-service")) {
          let dataService = el.dataset.service;
          requestPopup.dataset.service = dataService;
        }
        
        html.classList.add('overflow-hidden');
        overlay.style.display = 'block';

        document.querySelector('[data-popup='+dataPopup+']').style.display = 'flex';
        setTimeout(function() {
          overlay.classList.add('active');
          document.querySelector('[data-popup='+dataPopup+']').classList.add('active');
        }, 50);
      });
    })
  }

  // inputmask
  let inputsPhone = Array.from(document.querySelectorAll('input[type="tel"]'));
  let phoneMask = new Inputmask(
    "+7 (999) 999-99-99", {
      "clearIncomplete": true,
      "onincomplete": function() {
        this.closest('form').querySelector('.btn-submit').classList.add('disabled'), this.classList.add('input-error')
      },
      "oncomplete": function() {
        this.closest('form').querySelector('.btn-submit').classList.remove('disabled'), this.classList.remove('input-error')
      }
  });

  let inputsMail = Array.from(document.querySelectorAll('input[type="email"]'));
  let emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (inputsPhone) {
    inputsPhone.map(function(el) {
      phoneMask.mask(el);
    });
  }

  if (inputsMail) {
    inputsMail.map(function(el) {
      el.addEventListener('input', function() {
        let test = emailRegExp.test(el.value);
        if (test) {
          el.closest('form').querySelector('.btn-submit').classList.remove('disabled');
        } else {
          el.closest('form').querySelector('.btn-submit').classList.add('disabled');
        }
      });
    });
  }

  // contacts map
  let contactsMap = document.querySelector('#contacts__map');

  if (contactsMap) {
    let executed = false;

    document.addEventListener('scroll', function() {
      if (executed == false && elementInViewport(contactsMap)) {
        showContactsMap();
        executed = true;
      }
    });

    if (elementInViewport(contactsMap)) {
      if (executed == false && elementInViewport(contactsMap)) {
        setTimeout(function() {
          showContactsMap();
          executed = true;
        }, 1000)
      }
    }
  }

  // animations
  let elementsWithAnimation = Array.from(document.querySelectorAll('.to-animate'));

  if (elementsWithAnimation) {
    elementsWithAnimation.map(function(el) {
      
      if (elementInViewport(el)) {
        el.classList.add('animated');
      }

      window.addEventListener('scroll', function() {
        if (elementInViewport(el)) {

          setTimeout(function() {
            el.classList.add('animated');
          }, 20);

        }
        // else {
        //   el.classList.remove('animated');
        // }
      });
    });
  }

  if (document.querySelector('.about__images__wrap')) {
     window.addEventListener('scroll', function() {

      let windowTop = window.pageYOffset;
      let parentOffsetTop = document.querySelector('.about__images__wrap').offsetTop;
      let parentScrolled = parentOffsetTop + document.querySelector('.about__images__wrap').offsetHeight;
      let scrolledEl = document.querySelector('.about__image:nth-child(1)');
      let scrolledEl2 = document.querySelector('.about__image:nth-child(2)');
      let stopElHeight = document.querySelector('.about__image:nth-child(3)').offsetHeight;
      let customStopOffsetTop = -80;

      // console.log('windowTop='+windowTop);
      // console.log('parentScrolled='+parentScrolled);
      // console.log('stopElHeight='+stopElHeight);

      if (windowTop > parentOffsetTop) {

        scrolledEl.classList.add('flowing');

        if (windowTop > (parentScrolled - stopElHeight - customStopOffsetTop)) {
          scrolledEl.classList.remove('flowing');
          scrolledEl.classList.add('stop');

          scrolledEl2.classList.remove('flowing');
          scrolledEl2.classList.add('stop');
        } else {
          scrolledEl.classList.remove('stop');
          scrolledEl.classList.add('flowing');

          scrolledEl2.classList.remove('stop');
          scrolledEl2.classList.add('flowing');
        }

        customStopOffsetTop = 70;

        if (windowTop > (parentScrolled - stopElHeight - customStopOffsetTop)) {
          scrolledEl2.classList.remove('flowing');
          scrolledEl2.classList.add('stop');
        } else {
          scrolledEl2.classList.remove('stop');
          scrolledEl2.classList.add('flowing');
        }

      } else {
        scrolledEl.classList.remove('flowing');
        scrolledEl.classList.remove('stop');

        scrolledEl2.classList.remove('flowing');
        scrolledEl2.classList.remove('stop');
      }
    }); 
  }

  // functions
  function stickyNavigation() {
    if (window.scrollY >= 20) {
      document.body.style.paddingTop = nav.offsetHeight + 'px';
      nav.classList.add('fixed');
    } else {
      document.body.style.paddingTop = 0;
      nav.classList.remove('fixed');
    }
  }

  function elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  }

  function showContactsMap() {
    let contactsMap = document.querySelector('#contacts__map');
    let mapInitialised = false;

    if (!document.querySelector('script[src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"]')) {
        let scriptYMap = document.createElement('script');
        let scriptsMain = document.querySelector('#main-scripts');

        scriptYMap.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        scriptsMain.before(scriptYMap);

        scriptYMap.onload = function(event) {
          ymaps.ready(contactsMapInit);
          mapInitialised = true;
        }
    } else {
      if ((contactsMap.childNodes.length < 1) && (mapInitialised = false)) {
        contactsMapInit();
      }
    }     
  }

  function contactsMapInit() {
    contactsMap = new ymaps.Map('contacts__map', {
      center: [55.735277, 37.670250],
      zoom: 17
    }),

    myPlacemark = new ymaps.Placemark([55.735277, 37.670250], {}, {
      iconLayout: 'default#image',
    });

    contactsMap.geoObjects.add(myPlacemark);
    contactsMap.behaviors.disable('scrollZoom');
    contactsMap.controls.remove('searchControl');
  };

  function makeScroll(target, customOffsetTop) {
    if (customOffsetTop) {
      smoothScroll(target, {
        offset: customOffsetTop,
        getEasingFunction: function(targetPosition) {
          return function(stepCount) {
            return stepCount * 0.02;
          };
        }
      });
    } else {
      smoothScroll(target, {
        getEasingFunction: function(targetPosition) {
          return function(stepCount) {
            return stepCount * 0.02;
          };
        }
      });
    }
  };

  function showCurTab(tabsSwitch) {
    let curTabData = tabsSwitch.dataset.tab;
    let tabs = tabsSwitch.closest('.tabs__wrap').querySelector('.tabs').children;
    Array.from(tabs).forEach(function(tab) {
      if (tab.dataset.tab !== curTabData) {
        tab.classList.remove('active');
      } else {
        tab.classList.add('active');
      }
    });
  };
});