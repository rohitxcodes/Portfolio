/**
 * Animation Utilities Module
 * Handles text rotation, cursor effects, and other animations
 */

class AnimationUtils {
  constructor() {
    this.init();
  }

  init() {
    this.setupTextRotation();
    this.setupCursorEffects();
    this.setupColorChanger();
  }

  /**
   * Text rotation animation for typing effect
   */
  setupTextRotation() {
    class TxtRotate {
      constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
      }

      tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = `<span class=\"wrap\">${this.txt}</span>`;

        const delta = this.isDeleting ? 100 : 200 - Math.random() * 100;

        if (!this.isDeleting && this.txt === fullTxt) {
          setTimeout(() => {
            this.isDeleting = true;
            this.tick();
          }, this.period);
        } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          setTimeout(() => this.tick(), 100);
        } else {
          setTimeout(() => this.tick(), delta);
        }
      }
    }

    // Initialize text rotation on window load
    window.addEventListener('load', () => {
      const elements = document.getElementsByClassName('txt-rotate');
      
      for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        
        if (toRotate) {
          new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
      }

      // Inject CSS for text rotation cursor
      const css = document.createElement('style');
      css.type = 'text/css';
      css.innerHTML = '.txt-rotate > .wrap { border-right: 0em solid #666; }';
      document.body.appendChild(css);
    });
  }

  /**
   * Custom cursor effects
   */
  setupCursorEffects() {
    const body = document.querySelector('body');
    const $cursor = $('.cursor');

    if ($cursor.length === 0) return;

    const cursormover = (e) => {
      gsap.to($cursor, {
        x: e.clientX,
        y: e.clientY,
        stagger: 0.002
      });
    };

    const cursorhover = () => {
      gsap.to($cursor, {
        scale: 1.4,
        opacity: 1
      });
    };

    const cursor = () => {
      gsap.to($cursor, {
        scale: 1,
        opacity: 0.6
      });
    };

    // Bind cursor events
    $(window).on('mousemove', cursormover);
    $('.menubar').hover(cursorhover, cursor);
    $('a').hover(cursorhover, cursor);
    $('.navigation-close').hover(cursorhover, cursor);
  }

  /**
   * Color theme changer functionality
   */
  setupColorChanger() {
    $('.color-panel').on('click', (e) => {
      e.preventDefault();
      $('.color-changer').toggleClass('color-changer-active');
    });

    $('.colors a').on('click', (e) => {
      e.preventDefault();
      const theme = $(e.target).attr('title');
      this.changeTheme(theme);
    });
  }

  /**
   * Change color theme
   * @param {string} themeName - Name of the theme to apply
   */
  changeTheme(themeName) {
    // Remove existing theme classes
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    
    // Add new theme class
    document.body.classList.add(`theme-${themeName.replace('color-', '')}`);
    
    // Update CSS custom properties
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, '');
    document.documentElement.classList.add(`theme-${themeName.replace('color-', '')}`);\n    
    // Save theme preference
    localStorage.setItem('portfolioTheme', themeName);
    
    console.log(`Theme changed to: ${themeName}`);
  }

  /**
   * Load saved theme preference
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem('portfolioTheme');
    if (savedTheme) {
      this.changeTheme(savedTheme);
    }
  }

  /**
   * Smooth scroll to element
   * @param {string} target - Target element selector
   * @param {number} duration - Animation duration in seconds
   */
  smoothScrollTo(target, duration = 1) {
    gsap.to(window, {
      duration,
      scrollTo: target,
      ease: "power2.out"
    });
  }

  /**
   * Fade in animation for elements
   * @param {string} selector - Element selector
   * @param {number} delay - Animation delay
   */
  fadeIn(selector, delay = 0) {
    gsap.from(selector, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay,
      ease: "power2.out"
    });
  }

  /**
   * Scale animation for elements
   * @param {string} selector - Element selector
   * @param {number} scale - Target scale value
   */
  scaleElement(selector, scale = 1.05) {
    gsap.to(selector, {
      scale,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  /**
   * Reset element scale
   * @param {string} selector - Element selector
   */
  resetScale(selector) {
    gsap.to(selector, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  /**
   * Parallax effect for background elements
   * @param {string} selector - Element selector
   * @param {number} speed - Parallax speed (0-1)
   */
  parallax(selector, speed = 0.5) {
    $(window).on('scroll', () => {
      const scrollTop = $(window).scrollTop();
      gsap.to(selector, {
        y: scrollTop * speed,
        ease: "none"
      });
    });
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationUtils;
} else {
  window.AnimationUtils = AnimationUtils;
}