
/**
 * @file Creates and injects randomly positioned decorative icons into a container.
 * This module is designed to add a subtle, dynamic background texture to a specific section.
 */
'use strict';

// --- CONFIGURATION ---

// An array of icon filenames located in the `Assets/icons/` directory.
const ICONS = [
    'heart.svg',
    'heartbeat.svg',
    'first-aid-kit.svg',
    'pulse.svg',
    'stethoscope.svg',
    'first-aid.svg',
    'pill.svg',
    'thermometer-simple.svg',
    'ambulance.svg'
];

// The total number of icons to be scattered in the background.
const ICON_COUNT = 35;

// The container element where the icons will be injected.
const TARGET_SELECTOR = '#about-mission';

// --- MODULE LOGIC ---

/**
 * Generates a random number within a specified range.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random number between min and max.
 */
const randomNumber = (min, max) => Math.random() * (max - min) + min;

/**
 * Creates a single, randomly styled icon element.
 * @returns {HTMLImageElement} An `<img>` element with randomized inline styles.
 */
const createIcon = () => {
    const icon = document.createElement('img');
    const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)];

    // Note the path is relative to the page it's loaded on (about.html is in /pages)
    icon.src = `../Assets/icons/${randomIcon}`;
    icon.className = 'background-icon';
    icon.setAttribute('aria-hidden', 'true'); // Decorative, so hide from screen readers

    // Apply random styles for a scattered effect
    icon.style.top = `${randomNumber(5, 95)}%`;
    icon.style.left = `${randomNumber(5, 95)}%`;
    icon.style.width = `${Math.round(randomNumber(20, 45))}px`; // Max size of 45px
    icon.style.transform = `rotate(${randomNumber(-45, 45)}deg)`;
    icon.style.animationDelay = `${randomNumber(0, 5)}s`; // For potential future animations

    return icon;
};

/**
 * Initializes the scattered icons effect by injecting them into the target container.
 * The function will only run if the target container is found on the page.
 */
const initScatteredIcons = () => {
    const container = document.querySelector(TARGET_SELECTOR);
    if (!container) {
        // Silently fail if the target container is not on the current page.
        return;
    }

    // Use a document fragment for performance to append all icons at once.
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < ICON_COUNT; i++) {
        fragment.appendChild(createIcon());
    }

    // Append the fragment to the container, causing only one DOM reflow.
    container.appendChild(fragment);
};

export { initScatteredIcons };
