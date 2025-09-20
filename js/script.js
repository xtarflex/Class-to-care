document.addEventListener('DOMContentLoaded', function() {
    
    // --- MOBILE MENU FUNCTIONALITY ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    
    const openMenu = () => {
        document.body.classList.add('menu-is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        document.body.classList.remove('menu-is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    };

    if (hamburgerBtn && closeBtn && mobileNavOverlay) {
        hamburgerBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
    }

    // --- MOBILE ACCORDION SUBMENU ---
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parentLi = this.parentElement;
            const submenu = this.nextElementSibling;

            // Close all other open submenus
            parentLi.parentElement.querySelectorAll('.has-submenu').forEach(item => {
                if (item !== parentLi && item.classList.contains('is-open')) {
                    item.classList.remove('is-open');
                    item.querySelector('.mobile-submenu').style.maxHeight = null;
                    item.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the current submenu
            parentLi.classList.toggle('is-open');
            if (parentLi.classList.contains('is-open')) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                this.setAttribute('aria-expanded', 'true');
            } else {
                submenu.style.maxHeight = null;
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- DYNAMIC HEADER ON SCROLL (Both Mobile and Desktop) ---
    const siteHeader = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const isMobile = window.innerWidth < 992;

        // Logic for desktop: Hide on scroll down, show on scroll up
        if (!isMobile) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                siteHeader.classList.add('header--hidden');
            } else {
                siteHeader.classList.remove('header--hidden');
            }
        }

        // Logic for mobile: Add "detached/pill" style when scrolled
        if (isMobile) {
            if (currentScrollY > 50) {
                 siteHeader.classList.add('is-scrolled');
            } else {
                 siteHeader.classList.remove('is-scrolled');
            }
        }
        
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; // For Mobile or negative scrolling
    });

    // --- DESKTOP SUBMENU (HOVER & CLICK) ---
    const desktopSubmenuHandler = () => {
        const isDesktop = window.innerWidth >= 992;
        if (!isDesktop) return;

        const submenus = document.querySelectorAll('.main-nav .has-submenu');
        let leaveTimeout;

        submenus.forEach(submenu => {
            const link = submenu.querySelector('a');
            let enterTimeout;

            // Mouse-based interaction
            submenu.addEventListener('mouseenter', () => {
                clearTimeout(leaveTimeout);
                // Small delay on enter to prevent accidental opening
                enterTimeout = setTimeout(() => {
                    // Close any other open submenus
                    submenus.forEach(s => {
                        if (s !== submenu) {
                            s.classList.remove('is-active');
                            s.querySelector('a').setAttribute('aria-expanded', 'false');
                        }
                    });
                    submenu.classList.add('is-active');
                    link.setAttribute('aria-expanded', 'true');
                }, 100);
            });

            submenu.addEventListener('mouseleave', () => {
                clearTimeout(enterTimeout);
                // Delay on leave to allow moving to the submenu
                leaveTimeout = setTimeout(() => {
                    submenu.classList.remove('is-active');
                    link.setAttribute('aria-expanded', 'false');
                }, 350);
            });

            // Click-based interaction
            link.addEventListener('click', (e) => {
                // Allow navigation if it's a real link, but toggle for '#'
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    const isActive = submenu.classList.toggle('is-active');
                    link.setAttribute('aria-expanded', isActive);

                    // Close other submenus
                    submenus.forEach(s => {
                        if (s !== submenu) {
                            s.classList.remove('is-active');
                            s.querySelector('a').setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });
        });

        // --- ACCESSIBILITY (GLOBAL LISTENERS) ---
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.has-submenu')) {
                submenus.forEach(submenu => {
                    submenu.classList.remove('is-active');
                    submenu.querySelector('a').setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Close on 'Escape' key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                submenus.forEach(submenu => {
                    submenu.classList.remove('is-active');
                    submenu.querySelector('a').setAttribute('aria-expanded', 'false');
                });
            }
        });
    };

    desktopSubmenuHandler();
    // Optional: Re-run on resize if you want to be thorough, though DOMContentLoaded is usually enough
    // window.addEventListener('resize', desktopSubmenuHandler);
});