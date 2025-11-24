/**
 * @file Tabs Component
 * @description Handles switching between tab panels.
 */

export function initTabs() {
    const tabContainer = document.querySelector('.our-work-tabs');
    if (!tabContainer) return;

    const buttons = tabContainer.querySelectorAll('.tab-btn');
    const panels = tabContainer.querySelectorAll('.tab-panel');

    // 1. Click Event Listener
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Use aria-controls to identify the target panel for better accessibility
            const targetTab = btn.getAttribute('aria-controls') || btn.getAttribute('data-tab');
            if (targetTab) {
                switchTab(targetTab);
            }
        });
    });

    // 2. Core Switching Function
    function switchTab(tabId) {
        // Remove active class from all buttons and panels
        buttons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('active'));

        // Add active class to specific target
        // Find button that controls this tabId
        const activeBtn = Array.from(buttons).find(b =>
            b.getAttribute('aria-controls') === tabId || b.getAttribute('data-tab') === tabId
        );
        const activePanel = document.getElementById(tabId);

        if (activeBtn && activePanel) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
            activePanel.classList.add('active');

            // Re-trigger animations if any inside the panel
            const animatedElements = activePanel.querySelectorAll('[data-ani]');
            animatedElements.forEach(el => {
                el.classList.remove('ani-visible');
                // Force reflow to restart animation
                void el.offsetWidth;
                // The IntersectionObserver will pick this up, or CSS animation handles it
            });
        }
    }

    // 3. Deep Linking (Optional but Pro)
    // Check if URL has a hash (e.g. #projects) on load and switch to it
    const hash = window.location.hash.substring(1); // remove '#'
    if (hash) {
        // Check if a tab with this ID exists
        const targetPanel = document.getElementById(hash);
        if (targetPanel && targetPanel.classList.contains('tab-panel')) {
            switchTab(hash);
        }
    }
}
