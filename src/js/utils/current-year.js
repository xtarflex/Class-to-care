// src/js/utils/current-year.js

/**
 * @file A simple utility to find any element with the ID "current-year"
 * and set its text content to the current full year.
 */

export function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}