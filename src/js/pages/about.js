import { initAboutPageParallax } from '../components/parallax.js';
import { initFlipCards } from '../components/flip-cards.js'; // 1. IMPORT THE NEW MODULE

export function initAboutPage() {
 console.log("About Page JavaScript Initialized!");

 // Initialize the parallax effect for the mission section
 initAboutPageParallax();

 // Initialize the flip card tap mechanism
 initFlipCards(); // 2. CALL THE NEW FUNCTION
}
