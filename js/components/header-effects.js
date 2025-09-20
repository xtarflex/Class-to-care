/**
 * @file Manages header scroll effects.
 */

// --- Header Scroll Effects ---
// Manages the header's appearance based on scroll events.
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