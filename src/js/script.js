/**
 * @file Main application script.
 * This script is intended for global functionalities that need to run on every page.
 * Component-specific logic has been moved into self-initializing modules.
 */
'use strict';

// --- Import Initializers from Global & Utility Modules ---
import { initNavigation } from './components/navigation.js';
import { initSvgInjector } from './components/svg-injector.js';
import { initAnimateOnView } from './components/animate-on-view.js';
import { initTodoLinks } from './utils/todo-links.js';
import { initCurrentYear } from './utils/current-year.js';
import { initHeaderEffects } from './components/header-effects.js';
import { initStatePage } from './components/state-pages.js';

// --- Page-Specific Initializers ---
// Page-specific modules are now loaded dynamically.

// --- Main Initialization Function ---
function main() {
    // Run all the initializers
    initNavigation();
    initHeaderEffects();
    initSvgInjector();
    initAnimateOnView();
    initTodoLinks();      // 3. RUN TODO SCRIPT
    initCurrentYear();    // 4. RUN YEAR SCRIPT

    // Handle dynamic text for state pages (Coming Soon, etc.)
    initStatePage();

    // Check which page we are on and run its specific logic
    const pageId = document.body.id;

    if (pageId === 'page-home') {
        import('./pages/home.js').then(module => module.initHomePage());
    } else if (pageId === 'page-about') {
        import('./pages/about.js').then(module => module.initAboutPage());
    } else if (pageId === 'page-work') {
        import('./pages/work.js').then(module => module.initWorkPage());
    }

    // Handle Newsletter Submission (Mock UI Feedback)
    handleFormSubmissions();
}

/**
 * Handles all form submissions on the site with mock feedback.
 */
function handleFormSubmissions() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload

            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;

            const originalText = btn.textContent;

            // UI Feedback
            btn.textContent = 'Subscribed!';
            btn.classList.add('btn--success'); // Using a class is cleaner
            btn.disabled = true;

            // Reset after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('btn--success');
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    });
}

// --- Run Everything ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}