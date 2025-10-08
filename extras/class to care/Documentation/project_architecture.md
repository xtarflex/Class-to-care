# Class to Care: Official Project Architecture

This document outlines the file structure, coding conventions, and build process for the Class to Care website project. It serves as the single source of truth for how our code is organized.

---

## 1. Directory Structure

The project is divided into two main folders: a `planning` folder (for design assets and documentation) and a `development` folder (for the live website code).

### 1.1 Planning Directory (`/class to care/`)

-   `/design/`: Contains all visual assets and mockups.
    -   `/assets/`: Raw, client-provided files (logos, photos).
    -   `/mockups/`: Final, exported design mockups (e.g., `homepage-desktop.png`).
-   `/documentation/`: Contains all project documentation.
    -   `brand_identity.md`: The official design system (colors, fonts, etc.).
    -   `design_specs.md`: Handoff notes for component styles.
    -   `animation_guide.md`: The motion design guide.
    -   `meeting_notes.md`: A log of all client meetings.
    -   `project_architecture.md`: This file.
    -   `technical_details.md`: Specs for 404 pages, SEO, etc.
-   `/Roadmap/`: Contains high-level project planning.
    -   `project_plan.md`: The MVP feature list and timeline.

### 1.2 Development Directory (`/c2c-website/`)

This is the main codebase for the website.

-   `/css/`: Contains all source CSS files.
    -   `/base/`: Global styles.
        -   `_variables.css`
        -   `_resets.css`
        -   `_typography.css`
    -   `/components/`: Styles for reusable components.
        -   `_buttons.css`
        -   `_header.css`
        -   `_footer.css`
        -   ... etc.
    -   `/layout/`: Styles for page structure.
        -   `_grid.css`
    -   `/pages/`: Page-specific styles.
        -   `_home.css`
    -   `style.css`: The main file that imports all other partials.
-   `/js/`: Contains all source JavaScript files.
    -   `/components/`: Logic for specific components.
        -   `navigation.js`
        -   `header-effects.js`
    -   `script.js`: The main script file.
-   `/images/`: Optimized images for the website.
-   `/icons/`: Raw `.svg` files for icons used in the project.
-   `/dist/`: (Production Only) This folder will contain the bundled and minified output files.
    -   `style.bundle.css`
    -   `script.bundle.js`
-   `index.html`, `about.html`, etc.

---

## 2. Development Workflow

### CSS

-   We will use a component-based architecture, with styles organized into partial files (e.g., `_header.css`).
-   The main `style.css` will use the `@import` rule to assemble all partials in the correct order.

### JavaScript

-   We will use a non-module, multi-file approach for organizational purposes.
-   Logic for different features will be separated into files (e.g., `navigation.js`).
-   These files will be loaded in the correct order in the HTML file before the closing `</body>` tag.

---

## 3. Build Process (Production)

-   **Goal:** For the live website, we will serve a single, minified CSS file and a single, minified JavaScript file to maximize performance.
-   **Tooling:** We will use a lightweight tool or VS Code extension (e.g., Live Sass Compiler, Prepros) to automate this process.
-   **Process:** The tool will "watch" our source files (`/css/`, `/js/`) and, on save, will automatically:
    1.  **Bundle:** Combine all source files into a single output file in the `/dist/` folder.
    2.  **Minify:** Remove all unnecessary characters to reduce file size.

---

## 5. JavaScript Architecture

The project utilizes a modern, modular JavaScript architecture to ensure performance, scalability, and maintainability.

-   **Module System:** All JavaScript is written as native ES Modules (`import`/`export`).
-   **File Structure:** The `src/js/` directory is organized by concern:
    -   `components/`: Contains self-contained, reusable modules for specific UI components (e.g., `navigation.js`, `counter.js`).
    -   `pages/`: Contains page-specific logic (e.g., `home.js`) that imports and initializes the components needed for that particular page.
    -   `utils/`: For small, reusable helper functions.
-   **Code Splitting & Loading:**
    -   A single entry point, `script.js`, is loaded on each page using `<script type="module">`.
    -   This main script handles the initialization of global modules.
    -   It then uses conditional logic (based on the `<body>` ID) to dynamically `import()` and run the specific JavaScript for the current page.
-   **Build Process:** The Vite build tool (`npm run build`) automatically handles bundling, minification, and code-splitting based on this modular structure for an optimized production output.

---
