/**
 * Animate on View
 * - Observes elements with [data-ani]
 * - Adds .is-inview when first entering viewport
 * - Unobserves if data-ani-once!="false" (default true)
 * - Supports per-element threshold and rootMargin
 * - Staggering: parent with [data-ani-stagger=""] applies incremental delays to :scope > [data-ani]
 * - Exposes window.initAnimateOnView(root?) for rescanning dynamic content
 */
/**
 * @file The core script for the Animate on View system.
 * @summary Observes elements with [data-ani] and applies animations when they enter the viewport.
 * - Adds .is-inview when first entering viewport.
 * - Unobserves if data-ani-once!="false" (default true).
 * - Supports per-element threshold and rootMargin.
 * - Staggering: parent with [data-ani-stagger] applies incremental delays to :scope > [data-ani].
 */
'use strict';

/**
 * Initializes the Animate on View system. Scans a root element for [data-ani] attributes and sets up observers.
 * @param {Document | HTMLElement} [root=document] - The root element to scan for animations. Defaults to the entire document.
 */
function initAnimateOnView(root = document) {
  // Defaults can be changed globally if desired
  const DEFAULTS = {
    ani: 'fade-up',
    delay: 0, // ms
    duration: 600, // ms
    easing: 'ease-out',
    once: true,
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  };

  const hasIO = typeof window.IntersectionObserver === 'function';
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Observers cache, keyed by "threshold|rootMargin"
  const observers = new Map();
  // Remember per-element "once" preference
  const onceMap = new WeakMap();

  /**
   * Clamps a number between 0 and 1.
   * @param {*} n - The input value to clamp.
   * @returns {number} The clamped value.
   */
  function clamp01(n) {
    n = Number(n);
    if (!Number.isFinite(n)) return DEFAULTS.threshold;
    return Math.min(1, Math.max(0, n));
  }

  /**
   * Parses a time string (e.g., "150ms", "0.2s") into a number of milliseconds.
   * @param {string | number | null} input - The time string to parse.
   * @param {number} fallback - The value to return if parsing fails.
   * @returns {number} The time in milliseconds.
   */
  function parseTimeMs(input, fallback) {
    if (input == null || input === '') return fallback;
    if (typeof input === 'number') return input;

    const s = String(input).trim().toLowerCase();
    if (s.endsWith('ms')) {
      const v = parseFloat(s.slice(0, -2));
      return Number.isFinite(v) ? v : fallback;
    } else if (s.endsWith('s')) {
      const v = parseFloat(s.slice(0, -1));
      return Number.isFinite(v) ? v * 1000 : fallback;
    } else {
      const v = parseFloat(s);
      return Number.isFinite(v) ? v : fallback;
    }
  }

  /**
   * Gets a cached IntersectionObserver for a given threshold and rootMargin, or creates a new one.
   * @param {number} threshold - The visibility threshold for the observer.
   * @param {string} rootMargin - The root margin for the observer.
   * @returns {IntersectionObserver} The observer instance.
   */
  function getObserver(threshold, rootMargin) {
    const key = `${threshold}|${rootMargin}`;
    let obs = observers.get(key);
    if (obs) return obs;

    obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        const once = onceMap.get(el) ?? DEFAULTS.once;

        if (entry.isIntersecting) {
          // Trigger animation
          el.classList.add('is-inview');
          // If once, stop observing to save work
          if (once) {
            obs.unobserve(el);
          }
        } else {
          // Not intersecting; if replay enabled, reset for next entry
          if (!once) {
            // Remove class so the CSS animation can retrigger next time
            el.classList.remove('is-inview');
          }
        }
      }
    }, {
      threshold,
      root: null,
      rootMargin
    });

    observers.set(key, obs);
    return obs;
  }

  /**
   * Finds all stagger containers and applies incremental delays to their direct animated children.
   * @param {Document | HTMLElement} root - The root element to scan for stagger containers.
   */
  function applyStaggering(root) {
    const containers = root.querySelectorAll('[data-ani-stagger]');
    containers.forEach(container => {
      const inc = parseTimeMs(container.getAttribute('data-ani-stagger'), 0);
      // Direct children only
      const children = container.querySelectorAll(':scope > [data-ani]');

      children.forEach((child, index) => {
        // Preserve a base delay for idempotent recalculation across rescans
        if (child.__aniBaseDelay == null) {
          const base = parseTimeMs(child.getAttribute('data-ani-delay'), DEFAULTS.delay);
          child.__aniBaseDelay = base;
        }

        const finalDelay = child.__aniBaseDelay + (inc * index);
        child.style.setProperty('--ani-delay', `${finalDelay}ms`);
      });
    });
  }

  /**
   * Sets up a single element for animation, reading its data attributes and attaching it to an observer.
   * @param {HTMLElement} el - The element to prepare for animation.
   */
  function setupElement(el) {
    // Skip if already initialized
    if (el.classList.contains('ani-init')) return;
    el.classList.add('ani-init');
    
    // Ensure will-animate for initial state
    el.classList.add('will-animate');

    // Read attributes with fallbacks
    const aniName = (el.getAttribute('data-ani') || DEFAULTS.ani).trim();
    const delayMs = parseTimeMs(el.getAttribute('data-ani-delay'), DEFAULTS.delay);
    const durationMs = parseTimeMs(el.getAttribute('data-ani-duration'), DEFAULTS.duration);
    const easing = (el.getAttribute('data-ani-easing') || DEFAULTS.easing).trim();
    const onceAttr = el.getAttribute('data-ani-once');
    const once = onceAttr == null ? DEFAULTS.once : (String(onceAttr).toLowerCase() !== 'false');
    const threshold = clamp01(el.getAttribute('data-ani-threshold') ?? DEFAULTS.threshold);
    const rootMargin = (el.getAttribute('data-ani-root-margin') || DEFAULTS.rootMargin).trim();
    
    // Store once preference
    onceMap.set(el, once);

    // Ensure animation variant attribute is normalized (optional)
    el.setAttribute('data-ani', aniName);

    // Set CSS variables
    // Delay may be overridden by staggering; set a base now
    el.__aniBaseDelay = el.__aniBaseDelay ?? delayMs;
    el.style.setProperty('--ani-delay', `${el.__aniBaseDelay}ms`);
    el.style.setProperty('--ani-duration', `${durationMs}ms`);
    el.style.setProperty('--ani-easing', easing);

    // If reduced motion or no IO, reveal immediately (no animation)
    if (prefersReducedMotion || !hasIO) {
      el.classList.add('is-inview');
      return;
    }

    // Observe with per-element options
    const obs = getObserver(threshold, rootMargin);
    obs.observe(el);
  }

  // Find elements to animate
  const elements = root.querySelectorAll('[data-ani]:not(.ani-init)');
  elements.forEach(setupElement);

  // Apply/refresh staggering (idempotent)
  applyStaggering(root);
}

// Self-initialize on DOM load for initial elements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAnimateOnView());
} else {
    initAnimateOnView();
}

// Expose function globally for manual re-initialization on dynamic content
window.initAnimateOnView = initAnimateOnView;
