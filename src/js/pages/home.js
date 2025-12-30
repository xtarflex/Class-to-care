
// 1. IMPORT the specific modules needed for the homepage.
// We are importing the *initialization function* that each module now exports.
import { initCounters } from '../components/counter.js';
import { initTestimonialSlider } from '../components/testimonial-slider.js'; // 1. IMPORT

/**
 * Initializes all JavaScript functionality that is specific to the homepage.
 */
export function initHomePage() {
    // A console log is great for debugging to confirm the file is running.
    console.log("Homepage JavaScript Initialized!");
    
    // 2. RUN the initializers for the homepage-specific components.
    initCounters();
    
    // When we build the slider, we'll add:
    initTestimonialSlider(); // 2. CALL THE FUNCTION
}
