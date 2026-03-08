/**
 * @file accordion.js
 * @description Handles accessible accordion functionality.
 */

export function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        const triggers = accordion.querySelectorAll('.accordion-trigger');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                const contentId = trigger.getAttribute('aria-controls');
                const content = document.getElementById(contentId);

                // 1. Close all other items (Typical Accordion behavior)
                triggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                        const otherContentId = otherTrigger.getAttribute('aria-controls');
                        const otherContent = document.getElementById(otherContentId);
                        if (otherContent) {
                            otherContent.setAttribute('aria-hidden', 'true');
                            otherContent.style.gridTemplateRows = '0fr';
                        }
                    }
                });

                // 2. Toggle current item
                trigger.setAttribute('aria-expanded', !isExpanded);

                if (content) {
                    content.setAttribute('aria-hidden', isExpanded);
                    // Toggle CSS Grid state for smooth animation
                    content.style.gridTemplateRows = isExpanded ? '0fr' : '1fr';
                }
            });
        });
    });
}
