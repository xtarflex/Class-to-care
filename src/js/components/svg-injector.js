/**
 * @file SVG Injector Module (Version 3)
 * @description A robust module to fetch and inject SVG icons inline.
 * Replaces placeholder elements having a `data-icon` attribute with the corresponding SVG file's content.
 *
 * @feature In-memory promise caching to prevent race conditions and redundant fetches.
 * @feature MutationObserver to automatically handle dynamically added content.
 * @feature Secure SVG parsing via DOMParser.
 * @feature Configurable asset base path for project flexibility.
 * @feature Full accessibility attribute handling.
 */
'use strict';

// --- Configuration ---

// Default base path for icons. Can be overridden in two ways:
// 1. Globally before this script runs: `window.C2C_ICONS_BASE_PATH = "/custom/path/";`
// 2. Via the init function: `window.C2CIconsInit({ basePath: "/custom/path/" });`
const DEFAULT_ICONS_BASE_PATH = "/assets/icons/";
let ICONS_BASE_PATH = (typeof window !== "undefined" && window.C2C_ICONS_BASE_PATH) || DEFAULT_ICONS_BASE_PATH;

/**
 * @property {Map<string, Promise<string>>} CACHE - Stores promises for icon fetch requests.
 * Caching the promise itself handles concurrent requests for the same icon gracefully.
 */
const CACHE = new Map();
const PROCESSED_ATTR = "data-icon-injected";

/**
 * Constructs the full URL for a given icon name.
 * @param {string} name - The name of the icon (e.g., "users").
 * @returns {string} The complete URL to the SVG file.
 */
function buildUrl(name) {
    // Ensures there's exactly one slash between the path and the name.
    return ICONS_BASE_PATH.replace(/\/+$/, "") + "/" + name + ".svg";
}

/**
 * Fetches an SVG icon from the server or retrieves its promise from the cache.
 * @param {string} name - The name of the icon.
 * @returns {Promise<string>} A promise that resolves with the SVG text content.
 */
function fetchIcon(name) {
    if (CACHE.has(name)) {
        return CACHE.get(name);
    }

    const url = buildUrl(name);
    const fetchPromise = fetch(url, { credentials: "same-origin" })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to fetch SVG: ${res.status} ${res.statusText}`);
            }
            return res.text();
        });

    // Store the promise in the cache immediately.
    CACHE.set(name, fetchPromise);
    return fetchPromise;
}

/**
 * Parses an SVG text string into an SVGElement node using the secure DOMParser.
 * @param {string} svgText - The raw SVG string.
 * @returns {SVGElement} The parsed <svg> element.
 * @throws {Error} If the fetched content does not contain an <svg> element.
 */
function parseSVG(svgText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) {
        throw new Error("No <svg> element found in fetched content.");
    }
    return svg;
}

/**
 * Sets appropriate accessibility attributes on the SVG element.
 * @param {SVGElement} svgEl - The SVG element to modify.
 * @param {string|null} label - The accessible label from `data-icon-label`.
 */
function setA11y(svgEl, label) {
    if (label) {
        // If a label exists, it's a meaningful image.
        svgEl.setAttribute("role", "img");
        svgEl.setAttribute("aria-label", label);
        svgEl.setAttribute("focusable", "false"); // Prevents IE11 from making it tab-able.
        svgEl.removeAttribute("aria-hidden");
    } else {
        // If no label, it's decorative. Hide it from screen readers.
        svgEl.setAttribute("aria-hidden", "true");
        svgEl.setAttribute("focusable", "false");
        svgEl.removeAttribute("role");
        svgEl.removeAttribute("aria-label");
    }
}

/**
 * The core injection logic for a single placeholder element.
 * @async
 * @param {HTMLElement} el - The placeholder element with a `data-icon` attribute.
 * @returns {Promise<void>}
 */
async function injectInto(el) {
    try {
        // Ensure element is a valid node and hasn't been processed.
        if (!el || el.nodeType !== 1 || el.getAttribute(PROCESSED_ATTR) === "true") {
            return;
        }

        const name = el.getAttribute("data-icon");
        if (!name) {
            return;
        }

        // Mark as processed early to prevent re-triggering.
        el.setAttribute(PROCESSED_ATTR, "true");

        // Await the SVG content from fetch/cache.
        const svgText = await fetchIcon(name);
        const svg = parseSVG(svgText).cloneNode(true);

        // Apply standard classes.
        svg.classList.add("icon", `icon--${name}`);

        // Apply accessibility attributes.
        const label = el.getAttribute("data-icon-label");
        setA11y(svg, label);

        // Replace placeholder content, preserving the original container element and its attributes.
        el.textContent = "";
        el.appendChild(svg);

    } catch (err) {
        // Gracefully handle any errors during fetch or parse.
        if (el && el.nodeType === 1) {
            el.classList.add("icon--error");
            // Provide a fallback text if the element is empty.
            if (!el.textContent || el.textContent.trim() === "") {
                el.textContent = "[icon]";
            }
            // Still mark as processed to avoid re-fetching a known bad icon.
            el.setAttribute(PROCESSED_ATTR, "true");
        }
        console.warn(`SVG Injector error for icon "${el.getAttribute("data-icon")}":`, err.message);
    }
}

/**
 * Finds and processes all icon placeholders within a given root element.
 * @param {Document|HTMLElement} root - The node to search within. Defaults to `document`.
 */
function processAll(root = document) {
    const nodes = root.querySelectorAll("[data-icon]");
    nodes.forEach(injectInto);
}

// --- Dynamic Content Handling ---
let mutationObserver;
/**
 * Initializes a MutationObserver to watch for dynamically added nodes with `data-icon`.
 */
function observeLateAdded() {
    if (!("MutationObserver" in window) || mutationObserver) {
        return;
    }

    mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (!mutation.addedNodes || mutation.addedNodes.length === 0) continue;

            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue; // Only check element nodes.
                const el = /** @type {HTMLElement} */ (node);

                // Check if the added node itself is a placeholder.
                if (el.hasAttribute && el.hasAttribute("data-icon")) {
                    injectInto(el);
                }
                // Check if the added node contains any placeholders.
                const nested = el.querySelectorAll ? el.querySelectorAll("[data-icon]") : [];
                nested.forEach(injectInto);
            }
        }
    });

    mutationObserver.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });
}


/**
 * Main initialization function. Scans the DOM and sets up the observer.
 * @param {{basePath?: string}} [options] - Optional configuration.
 * @param {string} [options.basePath] - Overrides the default icon base path.
 */
function init(options) {
    if (options && typeof options.basePath === "string") {
        ICONS_BASE_PATH = options.basePath;
    }
    processAll(document);
    observeLateAdded();
}

export function initSvgInjector(options) {
    if (options && typeof options.basePath === "string") {
        ICONS_BASE_PATH = options.basePath;
    }
    processAll(document);
    observeLateAdded();
}
