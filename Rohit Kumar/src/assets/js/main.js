/**
 * Main JavaScript Entry Point
 * Initializes all modules and handles global app state
 * Rohit Kumar Portfolio v2.0
 */

class PortfolioApp {
  constructor() {
    this.navigation = null;
    this.animations = null;
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeModules());
      } else {
        this.initializeModules();
      }
    } catch (error) {
      console.error('Failed to initialize portfolio app:', error);
      this.handleError(error);
    }
  }

  /**
   * Initialize all modules
   */
  initializeModules() {
    console.log('🚀 Initializing Portfolio App...');

    // Initialize navigation module
    if (window.Navigation) {
      this.navigation = new Navigation();
      console.log('✅ Navigation module loaded');
    }

    // Initialize animation utilities
    if (window.AnimationUtils) {
      this.animations = new AnimationUtils();
      console.log('✅ Animation utilities loaded');
    }

    // Setup global event listeners
    this.setupGlobalEvents();

    // Initialize particles
    this.initializeParticles();

    // Setup performance monitoring
    this.setupPerformanceMonitoring();

    // Load user preferences
    this.loadUserPreferences();

    this.isInitialized = true;
    console.log('✅ Portfolio App initialized successfully');

    // Trigger custom event for other scripts
    document.dispatchEvent(new CustomEvent('portfolioAppReady', {
      detail: { app: this }
    }));
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEvents() {
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navigation) {
        // Close navigation menu on escape
        $('.navigation-close').click();
      }
    });

    // Handle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Initialize particles.js
   */
  initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles', {
        particles: {
          number: { 
            value: 40, 
            density: { enable: true, value_area: 800 } 
          },
          color: { value: '#ffffff' },
          shape: {
            type: 'circle',
            stroke: { width: 0, color: '#000000' },
            polygon: { nb_sides: 5 },
            image: { src: 'img/github.svg', width: 100, height: 100 }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    }
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide scroll to top button
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
      if (scrollTop > 300) {
        scrollButton.classList.add('visible');
      } else {
        scrollButton.classList.remove('visible');
      }
    }

    // Update navigation state based on scroll position
    if (this.navigation) {
      // Add scroll-based navigation updates here
    }
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    // Refresh particles on resize
    if (typeof pJSDom !== 'undefined' && pJSDom[0] && pJSDom[0].pJS) {
      pJSDom[0].pJS.fn.particlesRefresh();
    }

    // Update any responsive components
    this.updateResponsiveComponents();
  }

  /**
   * Handle visibility change events
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Pause animations when tab is not visible
      this.pauseAnimations();
    } else {
      // Resume animations when tab becomes visible
      this.resumeAnimations();
    }
  }

  /**
   * Update responsive components
   */
  updateResponsiveComponents() {
    const width = window.innerWidth;
    
    // Update mobile navigation if needed
    if (width <= 550) {
      document.body.classList.add('mobile');
    } else {
      document.body.classList.remove('mobile');
    }

    // Update tablet layout
    if (width > 550 && width <= 1024) {
      document.body.classList.add('tablet');
    } else {
      document.body.classList.remove('tablet');
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    if ('performance' in window) {
      // Monitor page load time
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
        
        // Log performance metrics
        if (performance.mark) {
          performance.mark('portfolio-app-loaded');
        }
      });
    }
  }

  /**
   * Load user preferences
   */
  loadUserPreferences() {
    // Load theme preference
    if (this.animations && this.animations.loadSavedTheme) {
      this.animations.loadSavedTheme();
    }

    // Load other preferences from localStorage
    const preferences = this.getStoredPreferences();
    this.applyPreferences(preferences);
  }

  /**
   * Get stored user preferences
   * @returns {Object} User preferences object
   */
  getStoredPreferences() {
    try {
      const stored = localStorage.getItem('portfolioPreferences');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
      return {};
    }
  }

  /**
   * Apply user preferences
   * @param {Object} preferences - Preferences object
   */
  applyPreferences(preferences) {
    // Apply reduced motion preference
    if (preferences.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }

    // Apply other preferences
    Object.keys(preferences).forEach(key => {
      this.applyPreference(key, preferences[key]);
    });
  }

  /**
   * Apply individual preference
   * @param {string} key - Preference key
   * @param {*} value - Preference value
   */
  applyPreference(key, value) {
    switch (key) {
      case 'theme':
        if (this.animations) {
          this.animations.changeTheme(value);
        }
        break;
      case 'animations':
        document.body.classList.toggle('no-animations', !value);
        break;
      default:
        // Handle other preferences
        break;
    }
  }

  /**
   * Pause animations for performance
   */
  pauseAnimations() {
    if (typeof gsap !== 'undefined') {
      gsap.globalTimeline.pause();
    }
  }

  /**
   * Resume animations
   */
  resumeAnimations() {
    if (typeof gsap !== 'undefined') {
      gsap.globalTimeline.resume();
    }
  }

  /**
   * Handle application errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    console.error('Portfolio App Error:', error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
      <div class="error-content">
        <h3>Something went wrong</h3>
        <p>Please refresh the page to continue.</p>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }

  /**
   * Get application status
   * @returns {Object} Status object
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      navigation: !!this.navigation,
      animations: !!this.animations,
      modules: {
        gsap: typeof gsap !== 'undefined',
        jquery: typeof $ !== 'undefined',
        particles: typeof particlesJS !== 'undefined'
      }
    };
  }
}

// Initialize app when DOM is ready
let portfolioApp = null;

$(document).ready(() => {
  portfolioApp = new PortfolioApp();
  
  // Expose app instance globally for debugging
  window.PortfolioApp = PortfolioApp;
  window.portfolioApp = portfolioApp;
});

// Legacy support for original script structure
$(function() {
  // Keep original functionality for compatibility
  console.log('💡 Legacy compatibility mode active');
});