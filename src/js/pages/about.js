import { initAboutPageParallax } from '../components/parallax.js';
import { initFlipCards } from '../components/flip-cards.js';
import { initHistoryTimeline } from '../components/timeline.js';

export function initAboutPage() {
 console.log("About Page JavaScript Initialized!");

 // Initialize the parallax effect for the mission section
 initAboutPageParallax();

 // Initialize the1 flip card tap mechanism
 initFlipCards();

 // Initialize the history timeline
 initHistoryTimeline();
}
