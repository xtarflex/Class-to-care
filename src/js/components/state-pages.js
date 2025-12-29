/**
 * @file Logic for state pages (Coming Soon, 404, etc.)
 * Handles dynamic text for Coming Soon / 404 pages based on the URL.
 */

/**
 * Initializes the state page logic.
 * Reads the pathname or 'page' query parameter to update the Page name in the DOM.
 */
export const initStatePage = () => {
    // 1. Check if we are actually on the Coming Soon page
    const pageNameEl = document.getElementById('page-name');
    const pageFeatureEl = document.getElementById('page-name-text');

    if (!pageNameEl) return; // Exit if elements aren't found

    // 2. Define a "Dictionary" for perfect naming
    // This maps your lowercase clean URLs to the exact text you want to show.
    const pageTitles = {
        '/donate': 'Donation',
        '/volunteer': 'Volunteer',
        '/partner': 'Partner',
        '/projects': 'Projects',
        '/fundraise': 'Fundraising',
        '/programs': 'Programs',
        '/news': 'News',
        '/gallery': 'Gallery',
        '/contact': 'Contact',
        '/privacy': 'Privacy Policy',
        '/terms': 'Terms of Service',
        '/get-involved': 'Get Involved'
    };

    // 3. Get the current path (e.g., "/our-work" or "/donate")
    // Robust: strip trailing slashes
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

    // 4. Determine the Display Name
    let displayName = "Feature"; // Default fallback

    if (pageTitles[currentPath]) {
        // A. If we found a match in our dictionary, use it!
        displayName = pageTitles[currentPath];
    } else {
        // B. Fallback: Check for ?page= parameter (legacy support)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('page')) {
            displayName = urlParams.get('page');
        }
        // C. Fallback: Auto-format the path (e.g. "/our-work" -> "Our Work")
        else if (currentPath !== '/' && currentPath !== '/coming-soon.html') {
            displayName = currentPath
                .substring(1)          // Remove leading slash
                .replace(/-/g, ' ');   // Replace hyphens with spaces

            // Capitalize each word (CSS text-transform can also do this, but JS is safer)
            displayName = displayName.replace(/\b\w/g, l => l.toUpperCase());
        }
    }

    // 5. Update the DOM
    if (pageNameEl) pageNameEl.textContent = displayName;

    // Optional: Update the "feature" text to match
    if (pageFeatureEl) pageFeatureEl.textContent = displayName + " page";

    // Update Tab Title if it's the coming soon page
    if (document.body.id === 'page-coming-soon') {
        document.title = `${displayName} - Coming Soon | Class to Care`;
    }
};