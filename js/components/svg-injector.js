/**
 * @file Self-initializing module to fetch and inject SVG icons inline.
 * Replaces elements with a `data-icon` attribute with the content of an SVG file.
 * Includes in-memory caching, error handling, and a MutationObserver for dynamic content.
 */
(function() {
    'use strict';

    // --- Configuration ---
    const ICONS_BASE_PATH = '/Assets/icons/';
    const PROCESSED_ATTR = 'data-icon-injected';

    // --- State ---
    const svgCache = new Map();
    const domParser = new DOMParser();

    /**
     * Fetches an SVG icon from the server or retrieves it from the cache.
     * @param {string} name - The name of the icon (e.g., "users").
     * @returns {Promise<string|null>} A promise that resolves with the SVG text content or null on error.
     */
    async function fetchIcon(name) {
        if (svgCache.has(name)) {
            return svgCache.get(name);
        }

        try {
            const url = `${ICONS_BASE_PATH}${name}.svg`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`SVG not found: ${response.status} ${response.statusText}`);
            }
            const svgText = await response.text();
            
            // Validate that the fetched text is actually an SVG
            if (!svgText.trim().startsWith('<svg')) {
                 throw new Error(`Invalid SVG content for icon: ${name}`);
            }

            svgCache.set(name, svgText);
            return svgText;
        } catch (error) {
            console.error(`Failed to fetch icon "${name}":`, error);
            svgCache.set(name, null); // Cache failure to prevent re-fetching a known bad icon
            return null;
        }
    }

    /**
     * Processes a single placeholder element, injecting the fetched SVG.
     * @param {HTMLElement} element - The placeholder element with a `data-icon` attribute.
     */
    async function injectIcon(element) {
        if (element.hasAttribute(PROCESSED_ATTR)) {
            return;
        }
        element.setAttribute(PROCESSED_ATTR, 'true');

        const iconName = element.dataset.icon;
        if (!iconName) {
            return;
        }

        const svgText = await fetchIcon(iconName);

        if (svgText === null) {
            element.classList.add('icon--error');
            element.textContent = '[icon]';
            return;
        }

        // Parse the SVG string into an SVGDocument
        const svgDocument = domParser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDocument.querySelector('svg');

        if (!svgElement) {
            element.classList.add('icon--error');
            element.textContent = '[icon]';
            console.error(`Could not parse SVG for icon: ${iconName}`);
            return;
        }
        
        // Prepare the SVG for injection
        svgElement.classList.add('icon', `icon--${iconName}`);

        // Handle accessibility attributes
        const label = element.dataset.iconLabel;
        if (label) {
            svgElement.setAttribute('role', 'img');
            svgElement.setAttribute('aria-label', label);
        } else {
            svgElement.setAttribute('aria-hidden', 'true');
            svgElement.setAttribute('focusable', 'false');
        }

        // Inject the SVG and clear the placeholder
        element.innerHTML = '';
        element.appendChild(svgElement);
    }

    /**
     * Finds and processes all icon placeholder elements within a given root node.
     * @param {Document|HTMLElement} rootNode - The node to search within.
     */
    function processAllIcons(rootNode = document) {
        const iconPlaceholders = rootNode.querySelectorAll(`[data-icon]:not([${PROCESSED_ATTR}])`);
        iconPlaceholders.forEach(injectIcon);
    }
    
    /**
     * Sets up a MutationObserver to watch for dynamically added icons.
     */
    function observeDynamicIcons() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        // Check if the added node itself is a placeholder or contains placeholders
                        if (node.nodeType === Node.ELEMENT_NODE) {
                           if (node.hasAttribute('data-icon')) {
                               injectIcon(node);
                           }
                           processAllIcons(node);
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // --- Initialization ---

    // Expose a manual init function for debugging or special cases
    window.C2CIconsInit = processAllIcons;
    
    // Auto-initialize when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processAllIcons();
            observeDynamicIcons();
        });
    } else {
        processAllIcons();
        observeDynamicIcons();
    }

})();