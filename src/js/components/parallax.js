/**
 * @file A simple, performant parallax effect for the 'Our Mission' image plank.
 * Applies a vertical transform to elements based on their visibility in the viewport.
 */

// Configuration for the effect
const PARALLAX_CONFIG = [
 { selector: '.mission__image-plank img:nth-child(1)', speed: -0.1 }, // Moves up faster
 { selector: '.mission__image-plank img:nth-child(2)', speed: 0.05 }, // Moves down slowly
 { selector: '.mission__image-plank img:nth-child(3)', speed: -0.08 } // Moves up
];

let elementsToAnimate = [];
let isTicking = false;

/**
 * The main loop that runs on each animation frame to update element positions.
 */
function updateParallax() {
 const { scrollY, innerHeight } = window;1

 for (const item of elementsToAnimate) {
 const rect = item.el.getBoundingClientRect();
 const elementTop = rect.top + scrollY;
 const elementHeight = rect.height;

 // Calculate when the element is in the viewport
 const ancher = scrollY + innerHeight;
 if (ancher > elementTop && scrollY < elementTop + elementHeight) {
 // Calculate the element's center relative to the viewport center
 const centerOffset = (rect.top + elementHeight / 2) - innerHeight / 2;
 const translateY = centerOffset * item.speed;
 
 // Apply the transform
 item.el.style.transform = `translateY(${translateY.toFixed(2)}px)`;
 }
 }
 isTicking = false;
}

/**
 * The scroll event handler. It uses requestAnimationFrame to avoid performance issues.
 */
function onScroll() {
 if (!isTicking) {
 requestAnimationFrame(updateParallax);
 isTicking = true;
 }
}

/**
 * Initializes the parallax effect by finding elements and attaching the scroll listener.
 */
export function initAboutPageParallax() {
 const isMobile = window.matchMedia('(max-width: 768px)').matches;
 if (isMobile) return;

 // Don't run this logic if the user prefers reduced motion
 const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (prefersReducedMotion) return;

 // Find and store the elements we need to animate
 elementsToAnimate = PARALLAX_CONFIG.map(config => ({
 el: document.querySelector(config.selector),
 speed: config.speed
 })).filter(item => item.el);

 if (elementsToAnimate.length > 0) {
 window.addEventListener('scroll', onScroll, { passive: true });
 // Run once on init to set initial positions
 updateParallax(); 
 }
}