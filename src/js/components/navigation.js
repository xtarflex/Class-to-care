/**
 * @file Manages all navigation-related functionality, self-initializing.
 * This includes the hamburger menu, mobile accordion, and desktop dropdowns.
 */
'use strict';

const initNavigation = () => {
    // Selectors are now scoped to this module.
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const mobileNavAccordions = document.querySelectorAll('.mobile-nav .accordion-toggle');
    const desktopNavItems = document.querySelectorAll('.main-nav .has-submenu');

    // If essential elements for mobile nav aren't present, we can probably stop.
    if (!hamburgerBtn || !closeBtn) {
        console.warn('Navigation elements (.hamburger-btn or .close-btn) not found. Skipping navigation setup.');
        return;
    }

    /**
     * Toggles the main mobile navigation menu by adding/removing the .menu-is-open class on the body.
     */
    const toggleMobileMenu = () => {
        const isMenuOpen = document.body.classList.toggle('menu-is-open');
        hamburgerBtn.setAttribute('aria-expanded', String(isMenuOpen));
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    closeBtn.addEventListener('click', toggleMobileMenu);

    mobileNavAccordions.forEach(toggle => {
        /**
         * Handles the mobile navigation accordion submenus.
         * Ensures only one submenu can be open at a time.
         * @param {Event} e - The event object from the click event.
         */
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = toggle.parentElement;
            const submenu = toggle.nextElementSibling;
            if (!parentLi || !submenu) return;

            const isOpen = parentLi.classList.contains('is-open');

            // Close all other open accordion items on the same level.
            const parentUl = parentLi.parentElement;
            if (parentUl) {
                parentUl.querySelectorAll(':scope > .has-submenu').forEach(item => {
                    if (item !== parentLi && item.classList.contains('is-open')) {
                        item.classList.remove('is-open');
                        const otherSubmenu = item.querySelector('.mobile-submenu');
                        const otherToggle = item.querySelector('.accordion-toggle');
                        if (otherSubmenu) otherSubmenu.style.maxHeight = null;
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }

            // Now, toggle the clicked item.
            parentLi.classList.toggle('is-open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
            submenu.style.maxHeight = !isOpen ? `${submenu.scrollHeight}px` : null;
        });
    });

    /**
     * A centralized function to close all open desktop submenus.
     */
    function closeAllDesktopSubmenus() {
        desktopNavItems.forEach(item => {
            item.classList.remove('is-active');
            const link = item.querySelector('a');
            if (link) {
                link.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Desktop-specific logic ---
    let enterTimeout, leaveTimeout;

    const handleDesktopNav = () => {
        if (window.innerWidth < 992) return;

        desktopNavItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;

            // --- Mouse Hover Interaction ---
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth < 992) return;
                clearTimeout(leaveTimeout);
                enterTimeout = setTimeout(() => {
                    closeAllDesktopSubmenus(); // Close others before opening
                    item.classList.add('is-active');
                    link.setAttribute('aria-expanded', 'true');
                }, 100);
            });

            item.addEventListener('mouseleave', () => {
                if (window.innerWidth < 992) return;
                clearTimeout(enterTimeout);
                leaveTimeout = setTimeout(() => {
                    item.classList.remove('is-active');
                    link.setAttribute('aria-expanded', 'false');
                }, 350);
            });

            // --- Click & Keyboard Interaction ---
            link.addEventListener('click', (e) => {
                if (window.innerWidth < 992) return;
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    const wasActive = item.classList.contains('is-active');
                    closeAllDesktopSubmenus();
                    if (!wasActive) {
                        item.classList.add('is-active');
                        link.setAttribute('aria-expanded', 'true');
                    }
                }
            });
        });
    };
    
    handleDesktopNav(); // Run on initial load

    // --- Accessibility: Global listeners to close submenus ---
    document.addEventListener('click', (e) => {
        if (window.innerWidth >= 992 && !e.target.closest('.has-submenu')) {
            closeAllDesktopSubmenus();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (window.innerWidth >= 992 && e.key === 'Escape') {
            closeAllDesktopSubmenus();
        }
    });

};

// Initialize when the DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}