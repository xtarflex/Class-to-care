/**
 * Main application script.
 * This script handles all interactive elements of the site, including:
 * - Mobile and desktop navigation (menus, submenus, accordions).
 * - Dynamic header effects based on scroll position and direction.
 *
 * The script is structured into logical sections for clarity and maintainability:
 * 1. DOM Element Selectors: Centralized access to all required DOM nodes.
 * 2. State Management: Tracks the application's state (e.g., scroll position).
 * 3. Helper Functions: Reusable utility functions (currently none needed).
 * 4. Core Functionality Modules: The main logic for different site features.
 * 5. Initialization & Event Listeners: The entry point that starts the script.
 */
document.addEventListener('DOMContentLoaded', () => {

    /* =================================== */
    /* 1. DOM ELEMENT SELECTORS          */
    /* =================================== */
    // This "control panel" provides a single place to manage all DOM queries.
    const siteHeader = document.querySelector('.site-header');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const mobileNavAccordions = document.querySelectorAll('.mobile-nav .accordion-toggle');
    const desktopNavItems = document.querySelectorAll('.main-nav .has-submenu');


    /* =================================== */
    /* 2. STATE MANAGEMENT               */
    /* =================================== */
    // Keeps track of the application's "memory" or state.
    let lastScrollY = window.scrollY;


    /* =================================== */
    /* 3. HELPER FUNCTIONS               */
    /* =================================== */
    // Small, reusable functions that perform a single task.
    // (No generic helpers needed for this script, but this is where they would go).


    /* =================================== */
    /* 4. CORE FUNCTIONALITY MODULES     */
    /* =================================== */

    // --- Navigation Handler ---
    // Manages all navigation-related functionality for both mobile and desktop.
    const handleNavigation = () => {

        /**
         * Toggles the main mobile navigation menu.
         */
        const toggleMobileMenu = () => {
            const isMenuOpen = document.body.classList.toggle('menu-is-open');
            hamburgerBtn.setAttribute('aria-expanded', isMenuOpen);
        };

        if (hamburgerBtn && closeBtn) {
            hamburgerBtn.addEventListener('click', toggleMobileMenu);
            closeBtn.addEventListener('click', toggleMobileMenu);
        }

        /**
         * Handles the mobile navigation accordion submenus.
         * Ensures only one submenu can be open at a time.
         * @param {Event} e - The event object from the click event.
         */
        mobileNavAccordions.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const parentLi = toggle.parentElement;
                const submenu = toggle.nextElementSibling;
                const isOpen = parentLi.classList.contains('is-open');

                // Close all other open accordion items on the same level.
                // This ensures only one submenu is visible at a time.
                parentLi.parentElement.querySelectorAll('.has-submenu').forEach(item => {
                    if (item !== parentLi && item.classList.contains('is-open')) {
                        item.classList.remove('is-open');
                        item.querySelector('.mobile-submenu').style.maxHeight = null;
                        item.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                    }
                });

                // Now, toggle the clicked item.
                parentLi.classList.toggle('is-open', !isOpen);
                toggle.setAttribute('aria-expanded', !isOpen);
                submenu.style.maxHeight = !isOpen ? `${submenu.scrollHeight}px` : null;
            });
        });


        /**
         * Handles desktop submenu visibility on hover and click for accessibility.
         * Includes delays to prevent accidental opening/closing.
         */
        if (window.innerWidth >= 992) {
            let enterTimeout, leaveTimeout;

            desktopNavItems.forEach(item => {
                const link = item.querySelector('a');

                // --- Mouse Hover Interaction ---
                /**
                 * Handles the mouseenter event for desktop navigation items.
                 * @param {Event} e - The event object from the mouseenter event.
                 */
                item.addEventListener('mouseenter', () => {
                    clearTimeout(leaveTimeout);
                    enterTimeout = setTimeout(() => {
                        closeAllDesktopSubmenus(); // Close others before opening
                        item.classList.add('is-active');
                        link.setAttribute('aria-expanded', 'true');
                    }, 100);
                });

                /**
                 * Handles the mouseleave event for desktop navigation items.
                 * @param {Event} e - The event object from the mouseleave event.
                 */
                item.addEventListener('mouseleave', () => {
                    clearTimeout(enterTimeout);
                    leaveTimeout = setTimeout(() => {
                        item.classList.remove('is-active');
                        link.setAttribute('aria-expanded', 'false');
                    }, 350);
                });

                // --- Click & Keyboard Interaction ---
                /**
                 * Handles the click event for desktop navigation links.
                 * @param {Event} e - The event object from the click event.
                 */
                link.addEventListener('click', (e) => {
                    // Toggle submenu only if it's a non-navigating link.
                    if (link.getAttribute('href') === '#') {
                        e.preventDefault();
                        const wasActive = item.classList.contains('is-active');
                        closeAllDesktopSubmenus();
                        // Re-toggle if it wasn't active before
                        if (!wasActive) {
                            item.classList.add('is-active');
                            link.setAttribute('aria-expanded', 'true');
                        }
                    }
                });
            });

            // --- Accessibility: Global listeners to close submenus ---
            /**
             * Handles global click events to close desktop submenus.
             * @param {Event} e - The event object from the click event.
             */
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.has-submenu')) {
                    closeAllDesktopSubmenus();
                }
            });

            /**
             * Handles global keydown events to close desktop submenus (e.g., Escape key).
             * @param {Event} e - The event object from the keydown event.
             */
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeAllDesktopSubmenus();
                }
            });
        }

        /**
         * A centralized function to close all open desktop submenus.
         * Useful for ensuring a clean state.
         */
        function closeAllDesktopSubmenus() {
            desktopNavItems.forEach(item => {
                item.classList.remove('is-active');
                item.querySelector('a').setAttribute('aria-expanded', 'false');
            });
        }
    };


    // --- Header Scroll Effects ---
    // Manages the header's appearance based on scroll events.
    /**
     * Manages the header's appearance based on scroll events.
     * @param {Event} e - The event object from the scroll event.
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


    // --- On-Scroll Animations ---
    // This section would contain an Intersection Observer to trigger
    // animations on elements as they enter the viewport.
    // Example: observer.observe(document.querySelector('.fade-in-section'));


    // --- SVG Icon Injection ---
    // This section would handle fetching and injecting SVG icons into the DOM,
    // which is a common pattern for using icon sprites.


    /* =================================== */
    /* 5. INITIALIZATION & EVENT LISTENERS */
    /* =================================== */

    // Initialize all core modules.
    handleNavigation();

    // Attach global event listeners.
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    // Note: A 'resize' event listener could be added here to re-initialize
    // navigation logic if the design changes significantly between breakpoints.

});