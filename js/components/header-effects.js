/**
 * @file Manages header scroll effects.
 */

// Get header element
const siteHeader = document.querySelector('.site-header');

/**
 * Manages the header's appearance based on scroll events.
 * Hides on scroll down and shows on scroll up for desktop.
 * Applies a 'scrolled' style on mobile.
 * Relies on a global `lastScrollY` variable from script.js.
 */
const handleHeaderScroll = () => {
    if (!siteHeader) return;

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
    // The check prevents negative values on overscroll in some browsers.
    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
};
