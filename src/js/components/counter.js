/**
 * @file Impact Counter Module (Version 3)
 * @description A performant module to animate numbers when they scroll into view.
 *
 * @feature Uses IntersectionObserver for efficient viewport detection.
 * @feature Respects `prefers-reduced-motion` for accessibility.
 * @feature Highly configurable via data-* attributes.
 * @feature High-performance `Intl.NumberFormat` with instance caching.
 * @feature Clean, modular architecture with small, testable helper functions.
 */
'use strict';

    // --- Constants & Configuration ---
    const DEFAULT_DURATION = 1600;
    const DEFAULT_EASING = "easeOutCubic";
    const DEFAULT_FORMAT = "comma";
    const OBSERVER_OPTIONS = {
        root: null,
        threshold: 0.35,
        rootMargin: "0px 0px -10% 0px" // Trigger when element is 10% from bottom of viewport
    };

    // --- State ---
    let observer = null;
    let mqlReduced = null;
    /**
     * @property {Map<string, Intl.NumberFormat>} formatterCache - Caches formatter instances
     * to avoid performance overhead in the animation loop. Key is "format|decimals".
     */
    const formatterCache = new Map();

    // --- Helper Functions ---

    /**
     * Checks if the user has requested reduced motion. Caches the media query list.
     * @returns {boolean} True if reduced motion is preferred.
     */
    function prefersReducedMotion() {
        if (typeof window === "undefined" || !("matchMedia" in window)) return false;
        if (!mqlReduced) mqlReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        return !!mqlReduced.matches;
    }

    /**
     * Calculates the number of decimal places from a string representation of a number.
     * @param {string} str - The number as a string (e.g., "123.45").
     * @returns {number} The number of decimal places (e.g., 2).
     */
    function getDecimalPlaces(str) {
        if (typeof str !== "string") str = String(str);
        const dotIdx = str.indexOf(".");
        if (dotIdx === -1) return 0;
        const right = str.slice(dotIdx + 1).replace(/[^\d]/g, ""); // Allow for non-numeric chars
        return right.length;
    }

    /**
     * Parses the current numerical value from an element's text content.
     * Robustly handles prefixes/suffixes and non-numeric characters.
     * @param {HTMLElement} el - The element to parse.
     * @returns {number} The parsed starting number, or 0 if none found.
     */
    function parseCurrentNumber(el) {
        const txt = (el.textContent || "").trim();
        const match = txt.match(/-?[\d,]+(\.\d+)?/); // Handles commas and decimals
        if (!match) return 0;
        const n = parseFloat(match[0].replace(/,/g, ''));
        return isFinite(n) ? n : 0;
    }

    /**
     * Retrieves an easing function by name.
     * @param {string} name - The name of the easing function (e.g., "linear").
     * @returns {(t: number) => number} The easing function.
     */
    function getEasing(name) {
        switch ((name || DEFAULT_EASING).toLowerCase()) {
            case "linear":
                return (t) => t;
            case "easeoutcubic":
            case "ease-out-cubic":
            default:
                return (t) => 1 - Math.pow(1 - t, 3);
        }
    }

    /**
     * Gets a cached or new Intl.NumberFormat instance for formatting numbers.
     * @param {string} format - The format style ('comma', 'compact', 'none').
     * @param {number} decimals - The number of decimal places.
     * @returns {Intl.NumberFormat|null} The formatter instance, or null if format is 'none'.
     */
    function getFormatter(format, decimals) {
        if (format === "none") return null;
        const key = `${format}|${decimals}`;
        if (formatterCache.has(key)) return formatterCache.get(key);

        let options = {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        };
        if (format === "compact") {
            options.notation = 'compact';
        }

        const fmt = new Intl.NumberFormat(undefined, options);
        formatterCache.set(key, fmt);
        return fmt;
    }

    /**
     * Formats a number value according to specified rules.
     * @param {number} value - The number to format.
     * @param {number} decimals - Number of decimal places.
     * @param {string} format - 'comma', 'compact', or 'none'.
     * @returns {string} The formatted number string.
     */
    function formatNumber(value, decimals, format) {
        if (format === "none") {
            return Number(value).toFixed(decimals);
        }
        const fmt = getFormatter(format, decimals);
        return fmt ? fmt.format(value) : String(value);
    }

    /**
     * Assembles the final string with prefix, formatted number, and suffix.
     * @param {string} prefix - The prefix string.
     * @param {string} numText - The formatted number string.
     * @param {string} suffix - The suffix string.
     * @returns {string} The complete display string.
     */
    function assemble(prefix, numText, suffix) {
        return `${prefix || ""}${numText}${suffix || ""}`;
    }

    // --- Core Animation Logic ---

    /**
     * Runs the animation for a single counter element using requestAnimationFrame.
     * @param {HTMLElement} el
     * @param {number} from - The starting number.
     * @param {number} to - The target number.
     * @param {number} decimals
     * @param {number} duration
     * @param {(t: number) => number} easingFn
     * @param {string} prefix
     * @param {string} suffix
     * @param {string} format
     */
    function animateCount(el, from, to, decimals, duration, easingFn, prefix, suffix, format) {
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Calculate progress as a value from 0 to 1.
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFn(progress);

            // Calculate the current value based on the eased progress.
            const currentValue = from + (to - from) * easedProgress;

            // Update the element's text content with the formatted value.
            el.textContent = assemble(prefix, formatNumber(currentValue, decimals, format), suffix);

            if (progress < 1) {
                // Continue the animation on the next frame.
                requestAnimationFrame(step);
            } else {
                // Animation finished, ensure the final value is exact.
                el.textContent = assemble(prefix, formatNumber(to, decimals, format), suffix);
                el.setAttribute("data-counted", "true");
            }
        }
        requestAnimationFrame(step);
    }

    /**
     * Prepares and initiates the count animation for an element.
     * Reads all configuration from the element's data attributes.
     * @param {HTMLElement} el - The counter element.
     */
    function startCount(el) {
        if (!el || el.getAttribute("data-counted") === "true") return;

        const rawTarget = el.getAttribute("data-target-number");
        const target = parseFloat(rawTarget);

        if (!isFinite(target)) {
            console.error("Invalid data-target-number on element:", el);
            el.setAttribute("data-count-error", "true");
            return;
        }

        // Read all configuration from data-* attributes with sensible defaults.
        const decimals = getDecimalPlaces(rawTarget);
        const rawDur = parseInt(el.getAttribute("data-count-duration"), 10);
        const duration = isFinite(rawDur) && rawDur > 0 ? rawDur : DEFAULT_DURATION;
        const easingFn = getEasing(el.getAttribute("data-count-easing"));
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        const format = (el.getAttribute("data-count-format") || DEFAULT_FORMAT).toLowerCase();
        const startVal = parseCurrentNumber(el);

        // Accessibility: If user prefers reduced motion, skip animation entirely.
        if (prefersReducedMotion() || duration === 0) {
            el.textContent = assemble(prefix, formatNumber(target, decimals, format), suffix);
            el.setAttribute("data-counted", "true");
            return;
        }

        // Start the animation.
        animateCount(el, startVal, target, decimals, duration, easingFn, prefix, suffix, format);
    }

    // --- Intersection Observer Logic ---

    /**
     * The callback function for the IntersectionObserver.
     * @param {IntersectionObserverEntry[]} entries - A list of entries.
     */
    function onIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = /** @type {HTMLElement} */ (entry.target);
                // Start the count and immediately unobserve to ensure it only runs once.
                if (observer) observer.unobserve(el);
                startCount(el);
            }
        });
    }

    /**
     * Lazily creates and returns the IntersectionObserver instance.
     */
    function ensureObserver() {
        if (!observer) {
            observer = new IntersectionObserver(onIntersect, OBSERVER_OPTIONS);
        }
    }

    /**
     * Scans a root element for counter nodes and sets them up for observation.
     * @param {Document|HTMLElement} [root=document] - The element to scan.
     */
    function scanAndObserve(root = document) {
        ensureObserver();
        const nodes = root.querySelectorAll(".impact__number");

        nodes.forEach((el) => {
            // Skip elements that have been processed or are invalid.
            if (el.getAttribute("data-counted") || el.getAttribute("data-count-error")) return;

            const targetAttr = el.getAttribute("data-target-number");
            if (!isFinite(parseFloat(targetAttr))) {
                el.setAttribute("data-count-error", "true");
                return;
            }
            observer.observe(el);
        });
    }

export function initCounters() {
    scanAndObserve(document);
}
