/**
 * @file timeline.js
 * @description This file contains the functionality for the history timeline on the About Us page.
 * It handles the animation of the timeline progress line and the appearance of timeline items as the user scrolls.
 */

/**
 * Initializes the history timeline functionality.
 *
 * This function sets up an IntersectionObserver to detect when timeline items
 * become visible in the viewport, adding a class to trigger animations. It also
 * attaches a scroll event listener to animate the timeline's progress line based
 * on the user's scroll position.
 *
 * @returns {void}
 */
export function initHistoryTimeline() {
 const timeline = document.querySelector('.history-timeline');
 if (!timeline) return;

 const line = timeline.querySelector('.history-timeline__line--progress');
 const items = timeline.querySelectorAll('.timeline-item');

 const observer = new IntersectionObserver(entries => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('is-visible');
 }
 });
 }, { threshold: 0.5 });

 items.forEach(item => observer.observe(item));

 let targetHeight = 0;
 let currentHeight = 0;
 const easing = 0.08; // Adjust this for more or less lag

 function updateTargetHeight() {
 const { top, height } = timeline.getBoundingClientRect();
 const scrollY = window.innerHeight - top;
 
 let progressHeight = Math.max(0, scrollY);
 if (progressHeight > height) {
 progressHeight = height;
 }
 
 targetHeight = progressHeight;
 }

 function animateLine() {
 // Smoothly interpolate currentHeight towards targetHeight
 currentHeight += (targetHeight - currentHeight) * easing;

 // To avoid tiny decimal values, we can round it or set a threshold
 if (Math.abs(targetHeight - currentHeight) < 0.5) {
 currentHeight = targetHeight;
 }

 line.style.height = `${currentHeight}px`;

 requestAnimationFrame(animateLine);
 }

 window.addEventListener('scroll', updateTargetHeight);
 updateTargetHeight(); // Run once on load
 animateLine(); // Start the animation loop
}