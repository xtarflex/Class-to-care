/**
 * @file The core script for the "Animate on View" system.
 * @summary Observes elements with [data-ani] and applies animations when they enter the viewport.
 */
'use strict';

  // --- CONFIGURATION & DEFAULTS ---

  const DEFAULTS = {
    ani: 'fade-up',
    delay: 0,
    duration: 600,
    easing: 'ease-out',
    once: true,
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px',
    mobileBreakpoint: 768 // px width to disable certain delays
  };

  // --- STATE & CACHES ---

  const hasIO = typeof window.IntersectionObserver === 'function';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observers = new Map(); // Cache for observer instances
  const onceMap = new WeakMap(); // Cache for per-element "once" preference

  // --- HELPER FUNCTIONS ---

  /**
   * Clamps a number between 0 and 1.
   * @param {*} n The input value.
   * @returns {number} The clamped value.
   */
  function clamp01(n) {
    n = Number(n);
    return !Number.isFinite(n) ? DEFAULTS.threshold : Math.min(1, Math.max(0, n));
  }

  /**
   * Parses a time string (e.g., "150ms", "0.2s") into milliseconds.
   * @param {string | number | null} input The time string.
   * @param {number} fallback The default value.
   * @returns {number} Time in milliseconds.
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
    }
    const v = parseFloat(s);
    return Number.isFinite(v) ? v : fallback;
  }

  // --- CORE LOGIC ---

  /**
   * Gets or creates a cached IntersectionObserver for a given configuration.
   * @param {number} threshold The observer threshold.
   * @param {string} rootMargin The observer root margin.
   * @returns {IntersectionObserver}
   */
  function getObserver(threshold, rootMargin) {
    const key = `${threshold}|${rootMargin}`;
    if (observers.has(key)) {
      return observers.get(key);
    }
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        const el = entry.target;
        const once = onceMap.get(el);
        if (entry.isIntersecting) {
          el.classList.add('is-inview');
          if (once) obs.unobserve(el);
        } else if (!once) {
          el.classList.remove('is-inview');
        }
      }
    }, { threshold, root: null, rootMargin });
    observers.set(key, observer);
    return observer;
  }

  /**
   * Applies incremental delays to direct children of a stagger container.
   * @param {Document|HTMLElement} root The element to scan.
   */
  function applyStaggering(root) {
    const containers = root.querySelectorAll('[data-ani-stagger]');
    containers.forEach(container => {
      const inc = parseTimeMs(container.getAttribute('data-ani-stagger'), 0);
      const children = container.querySelectorAll(':scope > [data-ani]');
      children.forEach((child, index) => {
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
   * Sets up a single element for animation.
   * @param {HTMLElement} el The element to set up.
   */
  function setupElement(el) {
    if (el.classList.contains('ani-init')) return;
    el.classList.add('ani-init', 'will-animate');

    // Read and normalize attributes
    const aniName = (el.getAttribute('data-ani') || DEFAULTS.ani).trim();
    const onceAttr = el.getAttribute('data-ani-once');
    const once = onceAttr == null ? DEFAULTS.once : (String(onceAttr).toLowerCase() !== 'false');
    const threshold = clamp01(el.getAttribute('data-ani-threshold') ?? DEFAULTS.threshold);
    const rootMargin = (el.getAttribute('data-ani-root-margin') || DEFAULTS.rootMargin).trim();
    
    // *** FINAL "CONTEXT-AWARE" DELAY LOGIC ***
    const isMobile = window.innerWidth < DEFAULTS.mobileBreakpoint;
    let delayMs = parseTimeMs(el.getAttribute('data-ani-delay'), DEFAULTS.delay);
    const playOnLoad = el.getAttribute('data-ani-load') === 'true';

    // On mobile, ONLY reset the delay to 0 IF the element is NOT flagged to play on load.
    if (isMobile && !playOnLoad) {
        delayMs = 0;
    }
    
    const durationMs = parseTimeMs(el.getAttribute('data-ani-duration'), DEFAULTS.duration);
    const easing = (el.getAttribute('data-ani-easing') || DEFAULTS.easing).trim();
    
    // Store preference and set attributes/variables
    onceMap.set(el, once);
    el.setAttribute('data-ani', aniName);
    el.__aniBaseDelay = el.__aniBaseDelay ?? delayMs;
    el.style.setProperty('--ani-delay', `${el.__aniBaseDelay}ms`);
    el.style.setProperty('--ani-duration', `${durationMs}ms`);
    el.style.setProperty('--ani-easing', easing);

    // Handle accessibility and fallbacks
    if (prefersReducedMotion || !hasIO) {
      el.classList.add('is-inview');
      return;
    }
    
    // Attach to observer
    getObserver(threshold, rootMargin).observe(el);
  }

  /**
   * Initializes the system, scanning a root element for animatable elements.
   * @param {Document|HTMLElement} [root=document] The element to scan.
   */
  function init(root = document) {
    const elements = root.querySelectorAll('[data-ani]:not(.ani-init)');
    elements.forEach(setupElement);
    applyStaggering(root);
  }

export { init as initAnimateOnView };
