/**
 * @file timeline.js
 * @description This file contains the functionality for the history timeline on the About Us page.
 * It handles the animation of the timeline progress line and the appearance of timeline items as the user scrolls.
 */

/**
 * Initializes the history timeline functionality.
 *
 * This function sets up an IntersectionObserver to detect when timeline items
 * become visible in the viewport, adding a class to trigger animations. It also
 * attaches a scroll event listener to animate the timeline's progress line based
 * on the user's scroll position.
 *
 * @returns {void}
 */
export function initHistoryTimeline() {
 const timeline = document.querySelector('.history-timeline');
 if (!timeline) return;

 const line = timeline.querySelector('.history-timeline__line--progress');
 const items = timeline.querySelectorAll('.timeline-item');

 const observer = new IntersectionObserver(entries => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('is-visible');
 }
 });
 }, { threshold: 0.5 });

 items.forEach(item => observer.observe(item));

//  CONFIG:How far from the bottom [in px] zhould the line ztop
const EDGE_BUFFER = 100;

function updateProgress(){
    const{top, height: totalTimelineHeight } = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // calculate how much of the timeline is "past" the buffer point
    // Logic:(Window Height - Buffer) - (Timeline's distance from the top)
    const activeZone = (windowHeight - EDGE_BUFFER) -top;

    // clamp the value between 0 and the total height of the timeline  
    let progressHeight = Math.max(0, Math.min(activeZone, totalTimelineHeight));

    // Apply immediately. No Easing loop needed because scroll is already smooth\
    line.style.height = `${progressHeight}px`;
}

// Use requestAnimationFrame to optimize the scroll listner
let isTicking = false;
window.addEventListener ('scroll',()=> {
    if (!isTicking) {
        window.requestAnimationFrame ( ()=> {
            updateProgress();
            isTicking = false;
        });
        isTicking = true;
    }
}, {passive: true});

// Run ocnce on load to set initial state
updateProgress();
}