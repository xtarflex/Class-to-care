/**
 * @file Main application script.
 * This script is intended for global functionalities that need to run on every page.
 * Component-specific logic has been moved into self-initializing modules.
 */
'use strict';

// --- Import Initializers from Global Modules ---
import { initNavigation } from './components/navigation.js';
import { initSvgInjector } from './components/svg-injector.js';
import { initAnimateOnView } from './components/animate-on-view.js';

// --- Page-Specific Initializers ---
import { initHomePage } from './pages/home.js';

// --- Main Initialization Function ---
function main() {
    // Run all the initializers
    initNavigation();
    initSvgInjector();
    initAnimateOnView();
    
    // Check if we are on the homepage and run its specific logic
    if (document.body.id === 'page-home') {
        initHomePage();
    }
}

// --- Run Everything ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
