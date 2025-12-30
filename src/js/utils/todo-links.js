// src/js/utils/todo-links.js

/**
 * @file A development-only utility to provide feedback on placeholder links.
 * Listens for clicks on any anchor tag with an href starting with "#TODO:".
 * It prevents the default page jump and logs a detailed warning to the console.
 */

export function initTodoLinks() {
    // This entire feature will ONLY run if the hostname is 'localhost' or '127.0.0.1'
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isDevelopment) {
        return; // Do nothing on the live production site
    }

    // Find all links that start with our #TODO: pattern
    const todoLinks = document.querySelectorAll('a[href^="#TODO:"]');

    if (todoLinks.length > 0) {
        console.log(`[Dev Helper] Found ${todoLinks.length} TODO links on this page.`);
    }

    todoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the annoying page jump to the top

            const todoInfo = link.getAttribute('href').substring(6); // Get the text after "#TODO:"

            // Log a clear, helpful warning to the developer console
            console.warn(
                `🚧 TODO Link Clicked 🚧\n\n` +
                `This link is a placeholder.\n` +
                `Intended Destination: "${todoInfo}"\n`,
                `Originating Element:`, link
            );

            // Optional: You could add a subtle visual indicator if you wanted
            // For example, make the link flash red for a moment
            link.style.transition = 'background-color 0.3s';
            link.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            setTimeout(() => {
                link.style.backgroundColor = 'transparent';
            }, 600);
        });
    });
}