/**
 * Animate on View
 * - Observes elements with [data-ani]
 * - Adds .is-inview when first entering viewport
 * - Unobserves if data-ani-once!="false" (default true)
 * - Supports per-element threshold and rootMargin
 * - Staggering: parent with [data-ani-stagger=""] applies incremental delays to :scope > [data-ani]
 * - Exposes window.initAnimateOnView(root?) for rescanning dynamic content
 */
(function () {
  'use strict';

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

  function clamp01(n) {
    n = Number(n);
    if (!Number.isFinite(n)) return DEFAULTS.threshold;
    return Math.min(1, Math.max(0, n));
  }

  // Parse time strings like "150", "150ms", "0.2s" into milliseconds number
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

  // Apply staggering: container[data-ani-stagger] -> :scope > [data-ani]
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

  function init(root = document) {
    // Find elements to animate
    const elements = root.querySelectorAll('[data-ani]:not(.ani-init)');
    elements.forEach(setupElement);

    // Apply/refresh staggering (idempotent)
    applyStaggering(root);
  }

  // Public API: rescan document or a sub-tree for new [data-ani] elements
  window.initAnimateOnView = init;

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(document));
  } else {
    init(document);
  }

  // Fallback for IntersectionObserver is handled within setupElement() by revealing immediately.
})();
