/**
 * Navigation Module
 * Handles menu interactions, page transitions, and navigation logic
 */

class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupLoader();
  }

  /**
   * Setup page loader
   */
  setupLoader() {
    $(window).on('load', () => {
      gsap.to('#loader', 1, { y: "-100%" });
      gsap.to('#loader', 1, { opacity: 0 });
      gsap.to('#loader', 0, { display: "none", delay: 1 });
      gsap.to('#header', 0, { display: "block", delay: 1 });
      gsap.to('#navigation-content', 0, { display: "none" });
      gsap.to('#navigation-content', 0, { display: "flex", delay: 1 });
    });
  }

  /**
   * Bind all navigation events
   */
  bindEvents() {
    // Menu toggle
    $('.menubar').on('click', () => {
      gsap.to('#navigation-content', 0.6, { y: 0 });
    });

    $('.navigation-close').on('click', () => {
      gsap.to('#navigation-content', 0.6, { y: "-100%" });
    });

    // Navigation links
    $('#about-link').on('click', () => this.navigateTo('about'));
    $('#contact-link').on('click', () => this.navigateTo('contact'));
    $('#portfolio-link').on('click', () => this.navigateTo('portfolio'));
    $('#blog-link').on('click', () => this.navigateTo('blog'));
    $('#home-link').on('click', () => this.navigateTo('home'));

    // Home logo navigation
    $('#home-logo').on('click', (e) => {
      e.preventDefault();
      this.navigateTo('home');
    });
  }

  /**
   * Handle page navigation with smooth transitions
   * @param {string} page - Target page name
   */
  navigateTo(page) {
    // Hide navigation menu
    gsap.to('#navigation-content', 0, { display: "none", delay: 0.7 });
    gsap.to('#navigation-content', 0, { y: '-100%', delay: 0.7 });

    // Hide all sections
    this.hideAllSections();

    // Show transition breaker
    this.showTransitionBreaker();

    // Show target section after delay
    setTimeout(() => {
      this.showSection(page);
      gsap.to('#navigation-content', 0, { display: 'flex', delay: 2 });
    }, 700);
  }

  /**
   * Hide all page sections
   */
  hideAllSections() {
    gsap.to('#header', 0, { display: "none" });
    gsap.to('#about', 0, { display: "none" });
    gsap.to('#blog', 0, { display: "none" });
    gsap.to('#portfolio', 0, { display: "none" });
    gsap.to('#contact', 0, { display: "none" });
  }

  /**
   * Show transition breaker animation
   */
  showTransitionBreaker() {
    gsap.to('#breaker', 0, { display: "block" });
    gsap.to('#breaker-two', 0, { display: "block", delay: 0.1 });
    gsap.to('#breaker', 0, { display: "none", delay: 2 });
    gsap.to('#breaker-two', 0, { display: "none", delay: 2 });
  }

  /**
   * Show specific section
   * @param {string} section - Section name to show
   */
  showSection(section) {
    const sectionId = section === 'home' ? '#header' : `#${section}`;
    gsap.to(sectionId, 0, { display: "block", delay: 0.7 });
  }

  /**
   * Get current active section
   * @returns {string} Current section name
   */
  getCurrentSection() {
    const sections = ['#header', '#about', '#portfolio', '#contact'];
    for (const section of sections) {
      if ($(section).is(':visible')) {
        return section.replace('#', '');
      }
    }
    return 'header';
  }

  /**
   * Update navigation state
   * @param {string} activeSection - Currently active section
   */
  updateNavigationState(activeSection) {
    $('.navigation-links a').removeClass('active');
    $(`#${activeSection}-link`).addClass('active');
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
} else {
  window.Navigation = Navigation;
}