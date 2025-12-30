// src/js/components/flip-cards.js

/**
 * @file Handles the flip-on-click interaction for the Core Values cards.
 * This is primarily for touch devices but also works on desktop.
 */

export function initFlipCards() {
 const valueCardWrappers = document.querySelectorAll('.value-card__wrapper');

 if (!valueCardWrappers.length) return;

 valueCardWrappers.forEach(wrapper => {
 wrapper.addEventListener('click', (e) => {
 // Prevent the click from doing anything else, like following a link
 e.preventDefault();

 const card = wrapper.querySelector('.value-card');
 if (card) {
 card.classList.toggle('is-flipped');
 }
 });
 });
}