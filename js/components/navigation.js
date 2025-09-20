/**
 * @file Manages all navigation-related functionality.
 */

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