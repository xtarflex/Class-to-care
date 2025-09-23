/**
 * Impact Counter Module
 * - Animates numbers from 0 to a target when they enter the viewport.
 * - Uses IntersectionObserver for performance.
 * - Respects prefers-reduced-motion for accessibility.
 * - Highly configurable via data-attributes.
 * - Self-initializes and exposes a manual init function.
 */
(function() {
  'use strict';

  // --- CONFIGURATION ---
  const PROCESSED_ATTR = 'data-counted';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- EASING FUNCTIONS ---
  const easingFunctions = {
    linear: t => t,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  };

  /**
   * Formats a number according to the specified format.
   * @param {number} num - The number to format.
   * @param {string} format - "none", "comma", or "compact".
   * @param {number} precision - Number of decimal places.
   * @returns {string} The formatted number string.
   */
  function formatNumber(num, format, precision) {
    const options = {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    };

    switch (format) {
      case 'comma':
        return num.toLocaleString(undefined, options);
      case 'compact':
        options.notation = 'compact';
        return num.toLocaleString(undefined, options);
      case 'none':
      default:
        return num.toFixed(precision);
    }
  }
  
  /**
   * The main animation function for a single counter element.
   * @param {HTMLElement} el - The counter element.
   */
  function animateCount(el) {
    // Read configuration from data attributes
    const target = parseFloat(el.dataset.targetNumber);
    const duration = parseInt(el.dataset.countDuration || '1600', 10);
    const easing = el.dataset.countEasing || 'easeOutCubic';
    const format = el.dataset.countFormat || 'comma';
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    // --- Safety & Idempotency Checks ---
    if (isNaN(target)) {
      el.setAttribute('data-count-error', 'true');
      console.error('Invalid data-target-number on element:', el);
      return;
    }
    el.setAttribute(PROCESSED_ATTR, 'true');

    // Determine decimal precision from the target number
    const targetStr = String(el.dataset.targetNumber);
    const precision = targetStr.includes('.') ? targetStr.split('.')[1].length : 0;
    
    const startValue = parseFloat(el.textContent) || 0;
    let startTime = null;

    // --- Accessibility Check ---
    if (prefersReducedMotion) {
      el.textContent = prefix + formatNumber(target, format, precision) + suffix;
      return;
    }

    // --- Animation Loop ---
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easingFunctions[easing] ? easingFunctions[easing](progress) : easingFunctions.easeOutCubic(progress);
      
      const currentValue = startValue + (target - startValue) * easedProgress;
      el.textContent = prefix + formatNumber(currentValue, format, precision) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Sets up the IntersectionObserver to watch counter elements.
   * @param {Document|HTMLElement} root - The element to scan for counters.
   */
  function init(root = document) {
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target); // Animate once
        }
      }
    }, {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.35,
    });

    const counters = root.querySelectorAll(`.impact__number:not([${PROCESSED_ATTR}])`);
    counters.forEach(counter => observer.observe(counter));
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }
  
  // Expose for manual re-scanning if needed
  window.C2CCounterInit = init;

})();