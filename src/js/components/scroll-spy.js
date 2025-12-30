/**
 * @file ScrollSpy logic to highlight sidebar links based on scroll position.
 * Handles both desktop active states and mobile horizontal scroll positioning.
 */

export function initScrollSpy() {
    const sections = document.querySelectorAll('.work-section');
    const navLinks = document.querySelectorAll('.scroll-link');
    const scrollNav = document.querySelector('.scroll-nav');

    if (!sections.length || !navLinks.length) return;

    // Configuration for IntersectionObserver
    const options = {
        root: null,
        // Trigger when the section is in the middle of the viewport
        rootMargin: '-20% 0px -60% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // 1. Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('is-active');
                    // Reset mobile text visibility logic if needed
                });

                // 2. Find and activate the current link
                const activeLink = document.querySelector(`.scroll-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('is-active');

                    // 3. Mobile Polish: Auto-scroll the horizontal bar
                    if (window.innerWidth < 992 && scrollNav) {
                        activeLink.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center' // Centers the button in the bar
                        });
                    }
                }
            }
        });
    }, options);

    // Start observing
    sections.forEach(section => {
        observer.observe(section);
    });
}