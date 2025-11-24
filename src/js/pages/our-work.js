import { initTabs } from '../components/tabs.js';
// Import generic animations if you want them on this page too
import { initAnimateOnView } from '../components/animate-on-view.js';

export function initOurWorkPage() {
    console.log("Our Work Page Initialized");

    // Initialize the Tabs
    initTabs();

    // Re-run animations if needed for the new content
    initAnimateOnView();
}
