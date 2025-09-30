/**
 * @file Main application script.
 * This script is intended for global functionalities that need to run on every page.
 * Component-specific logic has been moved into self-initializing modules.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // All component initializations have been moved to their respective files
    // in the /js/components/ directory. Each component now handles its own
    // lifecycle (DOM queries, event listeners, etc.).

    // This file is now the place for any truly global logic that doesn't
    // belong to a specific component but is needed across the site.

    // For example, you could add logic here to detect touch devices
    // and add a class to the body, which can be useful for CSS.
    /*
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice()) {
        document.body.classList.add('is-touch');
    }
    */

    console.log('Main script loaded. Self-initializing component modules are now active.');
});