/**
 * Counter Animation
 * - Animates numbers from 0 to target value when elements come into view
 * - Uses Intersection Observer API for performance
 * - Supports custom duration and easing
 * - Integrates with existing animate-on-view system
 */

'use strict';

/**
 * Initializes counter animations for elements with data-target attribute
 * @param {Document | HTMLElement} [root=document] - The root element to scan
 */
function initCounterAnimation(root = document) {
    const elements = root.querySelectorAll('.impact__number[data-target]');

    if (elements.length === 0) return;

    const hasIO = typeof window.IntersectionObserver === 'function';
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If no Intersection Observer support or reduced motion, show final values immediately
    if (!hasIO || prefersReducedMotion) {
        elements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            el.textContent = target + (target >= 40 ? '+' : '');
        });
        return;
    }

    // Counter animation function
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        const isLargeNumber = target >= 40;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current + (isLargeNumber ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (isLargeNumber ? '+' : '');
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Set up Intersection Observer for counter elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                const duration = parseInt(element.getAttribute('data-duration')) || 2000;

                // Start counter animation
                animateCounter(element, target, duration);

                // Unobserve after animation starts
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
    });

    // Observe all counter elements
    elements.forEach(element => {
        observer.observe(element);
    });
}

export { initCounterAnimation };
