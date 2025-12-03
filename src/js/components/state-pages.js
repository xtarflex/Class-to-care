/**
 * @file Logic for state pages (Coming Soon, 404, etc.)
 */

export function initStatePage() {
    // Only run this logic if we are on the "Coming Soon" page
    const pageId = document.body.id;
    
    if (pageId === 'page-coming-soon') {
        const params = new URLSearchParams(window.location.search);
        // Default to 'Feature' if no param is found
        const pageName = params.get('page') || 'Feature'; 
        
        // Update DOM elements
        const nameEl = document.getElementById('page-name');
        const textEl = document.getElementById('page-name-text');
        
        if (nameEl) nameEl.textContent = pageName;
        if (textEl) textEl.textContent = pageName;
        
        // Update Tab Title
        document.title = `${pageName} - Coming Soon | Class to Care`;
    }
}