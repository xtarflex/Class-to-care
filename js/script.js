/**
 * @file Main application script.
 * Initializes all modules and orchestrates the application.
 */
document.addEventListener('DOMContentLoaded', () => {

    /* =================================== */
    /* 2. STATE MANAGEMENT               */
    /* =================================== */
    // Keeps track of the application's "memory" or state.
    let lastScrollY = window.scrollY;

    /* =================================== */
    /* 5. INITIALIZATION & EVENT LISTENERS */
    /* =================================== */

    // Initialize all core modules.
    handleNavigation();
    initAnimateOnView();

    // Attach global event listeners.
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    // Note: A 'resize' event listener could be added here to re-initialize
    // navigation logic if the design changes significantly between breakpoints.

});