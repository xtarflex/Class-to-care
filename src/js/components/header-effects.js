/**
 * @file Manages header scroll effects, making it self-initializing.
 * Hides on scroll down, shows on scroll up for desktop, and applies a 'scrolled' style on mobile.
 */
'use strict';

const initHeaderEffects = () => {
    const siteHeader = document.querySelector('.site-header');
    if (!siteHeader) {
        // No header on this page, so do nothing.
        return;
    }

    let lastScrollY = window.scrollY;

    /**
     * Manages the header's appearance based on scroll events.
     */
    const handleHeaderScroll = () => {
        const currentScrollY = window.scrollY;
        const isMobile = window.innerWidth < 992;

        // Mobile behavior: Header gets a "scrolled" style after a small scroll.
        if (isMobile) {
            siteHeader.classList.toggle('is-scrolled', currentScrollY > 50);
        }
        // Desktop behavior: Header hides on scroll down and shows on scroll up.
        else {
            const isScrollingDown = currentScrollY > lastScrollY;
            const isPastThreshold = currentScrollY > 100;
            siteHeader.classList.toggle('header--hidden', isScrollingDown && isPastThreshold);
        }

        // Update the last scroll position for the next event.
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
};

export { initHeaderEffects };
