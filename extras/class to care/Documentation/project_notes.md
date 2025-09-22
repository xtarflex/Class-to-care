# Documentation Notes
This is an excellent and highly practicaa robust, reusable "Animate on View" system that we can use throughout the entire Class to Care website. Building this as a self-contained, dependency-free module is a professional approach that will pay dividends.

Based on your detailed requirements, here is the complete, production-ready code.

---
### **Filename: `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animate on View</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1 class="logo">Animate on View</h1>
            <p class="tagline">Lightweight, dependency-free scroll-trigger animations</p>
        </div>
    </header>

    <main>
        <div class="container hero">
            <h2 data-ani="fade-up">Smooth, performant entrance animations</h2>
            <p data-ani="fade-up" data-ani-delay="150">
                Using IntersectionObserver, CSS keyframes, and data attributes.
            </p>
            <img class="hero-img" src="https://images.unsplash.com/photo-1618005182384-a83a89db074f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Abstract colorful shapes" data-ani="zoom-in" data-ani-delay="300">
        </div>

        <div class="container">
            <h3>Pick an animation per element</h3>
            <div class="grid">
                <div class="card" data-ani>
                    <h4>Slide Up</h4>
                    <p>Default 600ms, ease-out.</p>
                </div>
                <div class="card" data-ani="slide-right">
                    <h4>Slide Right</h4>
                    <p>Slides from the left to right.</p>
                </div>
                <div class="card" data-ani="slide-left" data-ani-duration="900">
                    <h4>Slide Left</h4>
                    <p>Customize duration per element.</p>
                </div>
                <div class="card" data-ani="fade-down" data-ani-delay="150">
                    <h4>Fade Down</h4>
                    <p>Custom delay via data-ani-delay.</p>
                </div>
                <div class="card" data-ani="rotate-in">
                    <h4>Rotate In</h4>
                    <p>Subtle rotate + lift-in.</p>
                </div>
                <div class="card" data-ani="flip-in-x">
                    <h4>Flip In X</h4>
                    <p>3D flip around X-axis.</p>
                </div>
                 <div class="card" data-ani="flip-in-y">
                    <h4>Flip In Y</h4>
                    <p>3D flip around Y-axis.</p>
                </div>
                <div class="card" data-ani="blur-in">
                    <h4>Blur In</h4>
                    <p>Unglitchy blur-to-sharp entrance.</p>
                </div>
                <div class="card" data-ani="scale-in">
                    <h4>Scale In</h4>
                    <p>Scale from 0.85 to 1.0.</p>
                </div>
                <div class="card" data-ani="skew-in">
                    <h4>Skew In</h4>
                    <p>Skew to straight with lift.</p>
                </div>
                <div class="card" data-ani="zoom-out">
                    <h4>Zoom Out</h4>
                    <p>From 1.1x down to 1.0.</p>
                </div>
                 <div class="card" data-ani="slide-up" data-ani-once="false">
                    <h4>Re-animate on Re-entry</h4>
                    <p><code>data-ani-once="false"</code> to replay when re-entering.</p>
                </div>
            </div>
        </div>

        <div class="container">
            <h3>List with stagger</h3>
            <ul class="fancy-list" data-ani-stagger="120">
                <li data-ani="slide-right">One</li>
                <li data-ani="slide-right">Two</li>
                <li data-ani="slide-right">Three</li>
                <li data-ani="slide-right" data-ani-delay="200">Four (extra delay)</li>
                <li data-ani="slide-right">Five</li>
            </ul>
        </div>

        <div class="container">
             <h3>IntersectionObserver options per element</h3>
             <p data-ani="fade-in" data-ani-threshold="0.8" data-ani-root-margin="0px">
                This paragraph uses a custom threshold and rootMargin.
             </p>
        </div>

        <div class="container">
            <h3>Add more content to scroll</h3>
            <p>Scroll down to trigger more animations.</p>
            <div class="spacer"></div>
            <h3 data-ani="fade-up">Bottom content revealed after a big spacer.</h3>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>Reduced motion is respected via <code>prefers-reduced-motion</code>.</p>
        </div>
    </footer>

    <script src="animate-on-view.js"></script>
</body>
</html>
```

---
### **Filename: `styles.css`**
```css
/*
 * Animation utilities and demo styles
 * - .will-animate marks elements prepared for animation (initial state)
 * - .is-inview triggers the keyframe animation
 * - Data attributes pick the animation and timings
 * - CSS variables allow per-element overrides: --ani-duration, --ani-delay, --ani-easing
 */

/* Global defaults (can be overridden per element via JS-set CSS vars) */
:root {
  --ani-duration: 600ms;
  --ani-delay: 0ms;
  --ani-easing: ease-out;
}

/* Base: elements to animate start hidden/off-position */
.will-animate {
  opacity: 0;
  will-change: opacity, transform, filter;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* When in view, run the variant's keyframe.
   Each variant below assigns its own animation-name on .is-inview. */
.is-inview {
  /* Common animation properties use CSS variables for control */
  animation-duration: var(--ani-duration, 600ms);
  animation-delay: var(--ani-delay, 0ms);
  animation-timing-function: var(--ani-easing, ease-out);
  animation-fill-mode: both; /* retain final state */
}

/* ---------------------------
   Initial states per variant
   --------------------------- */

/* Fade */
.will-animate[data-ani="fade-in"] { opacity: 0; }
/* Fade + translate on Y */
.will-animate[data-ani="fade-up"]   { transform: translate3d(0, 16px, 0); }
.will-animate[data-ani="fade-down"] { transform: translate3d(0, -16px, 0); }
/* Slide (more distance) */
.will-animate[data-ani="slide-up"]   { transform: translate3d(0, 24px, 0); }
.will-animate[data-ani="slide-down"] { transform: translate3d(0, -24px, 0); }
.will-animate[data-ani="slide-left"] { transform: translate3d(24px, 0, 0); }
.will-animate[data-ani="slide-right"]{ transform: translate3d(-24px, 0, 0); }
/* Zoom / Scale */
.will-animate[data-ani="zoom-in"]   { transform: scale(0.92); }
.will-animate[data-ani="zoom-out"]  { transform: scale(1.08); }
.will-animate[data-ani="scale-in"]  { transform: scale(0.85); }
/* Rotate */
.will-animate[data-ani="rotate-in"] { transform: translate3d(0, 8px, 0) rotate(-6deg); }
/* Flip (3D) */
.will-animate[data-ani="flip-in-x"] { transform-origin: top center; transform: perspective(800px) rotateX(-80deg); }
.will-animate[data-ani="flip-in-y"] { transform-origin: center left; transform: perspective(800px) rotateY(-80deg); }
/* Blur */
.will-animate[data-ani="blur-in"]   { filter: blur(10px); }
/* Skew */
.will-animate[data-ani="skew-in"]   { transform: skewY(6deg) translate3d(0, 10px, 0); }


/* ---------------------------
   Keyframes
   --------------------------- */

/* Fades */
@keyframes ani-fade-in   { from { opacity: 0; } to { opacity: 1; } }
@keyframes ani-fade-up   { from { opacity: 0; transform: translate3d(0, 16px, 0); } to { opacity: 1; transform: none; } }
@keyframes ani-fade-down { from { opacity: 0; transform: translate3d(0, -16px, 0); } to { opacity: 1; transform: none; } }
/* Slides (with fade) */
@keyframes ani-slide-up   { from { opacity: 0; transform: translate3d(0, 24px, 0); } to { opacity: 1; transform: none; } }
@keyframes ani-slide-down { from { opacity: 0; transform: translate3d(0, -24px, 0); } to { opacity: 1; transform: none; } }
@keyframes ani-slide-left { from { opacity: 0; transform: translate3d(24px, 0, 0); } to { opacity: 1; transform: none; } }
@keyframes ani-slide-right{ from { opacity: 0; transform: translate3d(-24px, 0, 0); } to { opacity: 1; transform: none; } }
/* Zoom / Scale */
@keyframes ani-zoom-in   { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes ani-zoom-out  { from { opacity: 0; transform: scale(1.08); } to { opacity: 1; transform: scale(1); } }
@keyframes ani-scale-in  { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
/* Rotate */
@keyframes ani-rotate-in { from { opacity: 0; transform: translate3d(0, 8px, 0) rotate(-6deg); } to { opacity: 1; transform: rotate(0deg); } }
/* Flips */
@keyframes ani-flip-in-x { from { opacity: 0; transform: perspective(800px) rotateX(-80deg); } to { opacity: 1; transform: perspective(800px) rotateX(0deg); } }
@keyframes ani-flip-in-y { from { opacity: 0; transform: perspective(800px) rotateY(-80deg); } to { opacity: 1; transform: perspective(800px) rotateY(0deg); } }
/* Blur */
@keyframes ani-blur-in   { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
/* Skew */
@keyframes ani-skew-in   { from { opacity: 0; transform: skewY(6deg) translate3d(0, 10px, 0); } to { opacity: 1; transform: none; } }


/* ---------------------------
   Map variants to keyframes on .is-inview
   --------------------------- */
.is-inview[data-ani="fade-in"] { animation-name: ani-fade-in; }
.is-inview[data-ani="fade-up"] { animation-name: ani-fade-up; }
.is-inview[data-ani="fade-down"] { animation-name: ani-fade-down; }
.is-inview[data-ani="slide-up"] { animation-name: ani-slide-up; }
.is-inview[data-ani="slide-down"] { animation-name: ani-slide-down; }
.is-inview[data-ani="slide-left"] { animation-name: ani-slide-left; }
.is-inview[data-ani="slide-right"] { animation-name: ani-slide-right; }
.is-inview[data-ani="zoom-in"] { animation-name: ani-zoom-in; }
.is-inview[data-ani="zoom-out"] { animation-name: ani-zoom-out; }
.is-inview[data-ani="scale-in"] { animation-name: ani-scale-in; }
.is-inview[data-ani="rotate-in"] { animation-name: ani-rotate-in; }
.is-inview[data-ani="flip-in-x"] { animation-name: ani-flip-in-x; }
.is-inview[data-ani="flip-in-y"] { animation-name: ani-flip-in-y; }
.is-inview[data-ani="blur-in"] { animation-name: ani-blur-in; }
.is-inview[data-ani="skew-in"] { animation-name: ani-skew-in; }


/* ---------------------------
   Reduced motion
   --------------------------- */
/* If user prefers reduced motion, reveal without movement. */
@media (prefers-reduced-motion: reduce) {
  .will-animate {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    animation: none !important;
    will-change: auto !important;
  }
}

/* ---------------------------
   Demo styles (layout only)
   --------------------------- */
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1a1a1a; }
.container { max-width: 1100px; margin-inline: auto; padding: 2rem 1rem; }
.site-header, .site-footer { background: #0f172a; color: #e5e7eb; }
.logo { margin: 0; }
.tagline { margin: 0.25rem 0 0; opacity: 0.8; }
.hero { text-align: center; padding-top: 3rem; }
.hero h2 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 0.5rem; }
.hero-img { margin-top: 1.25rem; width: 100%; max-height: 420px; object-fit: cover; border-radius: 12px; }
.grid { display: grid; grid-template-columns: repeat( auto-fit, minmax(240px, 1fr) ); gap: 1rem; }
.card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.card h4 { margin: 0 0 0.25rem; }
.fancy-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem; }
.fancy-list li { padding: 0.75rem 1rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e5e7eb; }
.spacer { height: 60vh; }
/* Subtle focus outline for a11y */
:focus-visible { outline: 3px solid #60a5fa; outline-offset: 2px; }
```

---
### **Filename: `animate-on-view.js`**
```javascript
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
```

---

## Notes

### Adding New Animation Variants

1. Choose a descriptive name for the animation (e.g., `bounce-in`)
2. In styles.css:
   - Add initial state: `.will-animate[data-ani="bounce-in"]` 
   - Create keyframes: `@keyframes ani-bounce-in`
   - Map variant: `.is-inview[data-ani="bounce-in"]`

---
## Note 2
1. Remeber to add more photo variation to the photoztrip
2. Optimize the photoz
3. Re-touch the background image


## Todo

- [ ] Task 1
- [ ] Task 2

---

## Ideas

- Idea 1
- Idea 2