# JavaScript Architecture

This project follows a modular, component-based architecture for its JavaScript.

## File Structure

-   **`/js/script.js`**: The main entry point for the entire application. It loads global modules and then conditionally loads page-specific modules.

-   **`/js/components/`**: This directory contains self-contained, reusable modules that control specific UI components or global systems. Each module should export an `init()` function and should not execute any code on its own (i.e., no auto-initialization).
    -   `animate-on-view.js`: The global IntersectionObserver system for on-scroll animations.
    -   `navigation.js`: Handles all logic for the main site header and mobile menu.
    -   `svg-injector.js`: Injects SVG icons into the DOM.

-   **`/js/pages/`**: This directory contains scripts that are specific to a single page. Each file should export an `init<PageName>()` function.
    -   `home.js`: Contains all the logic and component initializations unique to the homepage (e.g., Impact Counter, Testimonial Slider).

-   **`/js/utils/`**: This directory is for small, generic helper functions that can be reused across multiple modules.

## Workflow

1.  Create a new component's logic in its own file within `/js/components/`.
2.  If the logic is page-specific, import and initialize the component from the appropriate file in `/js/pages/`.
3.  The main `script.js` will then dynamically import the page-specific script based on the `<body>` ID of the current page.
