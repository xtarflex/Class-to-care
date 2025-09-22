# Class to Care: Website Animation & Interaction Guide
 
 This document is the single source of truth for all animation, transition, and micro-interaction specifications for the website. It serves as a blueprint for the development phase to ensure a consistent and high-quality user experience.
 
 ---
 
 ## 1. Global Principles
 
 -   **Framework:** All animations will be implemented using modern, performant CSS (`Transitions`, `Transforms`, `@keyframes`) where possible.
 -   **Triggering:** On-scroll animations will be triggered using the JavaScript **Intersection Observer API** for optimal performance.
 -   **Timing:** Standard transitions will use a duration of `0.3s` with an `ease-out` timing function for a smooth and responsive feel, unless otherwise specified.
 
 ---
 
 ## 2. The "Wrapper" Architecture for Animations
 
 To prevent conflicts between CSS `transform` properties used for animation and those used for styling, we will follow a "wrapper-based" architecture.
 
 ### **The Guideline:**
 If an element requires a `transform` for its static design (e.g., `rotate`, `skew`, `scale`) or for a hover effect, it **MUST** be wrapped in a parent `div`. The entrance animation (`data-ani`) is then applied to the parent wrapper, while the styling `transform` is applied to the inner child element.
 
 ### **The Simple Rule of Thumb:**
 
 -   **Wrap It (Default):** For any styled component, card, image, or icon block, the default practice is to wrap it in a `div` and apply the `data-ani` attribute to the wrapper.
     ```html
     <!-- Correct: Wrapper handles animation, card handles styling -->
     <div data-ani="zoom-in">
         <div class="card" style="transform: rotate(2deg);">
             Card Content
         </div>
     </div>
     ```
 
 -   **Exception (Simple Text):** The only exception is for simple, block-level text elements like `<h1>`, `<h2>`, and `<p>` that do not have any static transforms applied. These can have the `data-ani` attribute placed directly on them for simplicity.
     ```html
     <!-- Correct: Simple text elements can be animated directly -->
     <h2 data-ani="fade-down">My Section Title</h2>
     <p data-ani="fade-up">My paragraph of text.</p>
     ```
 
 This rule ensures a clean separation of concerns and prevents CSS `transform` properties from overriding each other, leading to a more robust and maintainable codebase.
 
 ---
 
 ## 3. On-Page Load Animations
 
 ### Hero Section Entrance
 ---
 
## 4. On-Scroll Entrance Animations
 
A varied and purposeful set of default animations will be used for different types of content to create a sophisticated and dynamic user experience. These can be overridden on a per-element basis using `data-ani` attributes.
 
-   **Main Section Titles (`h2`):**
    -   **Default Animation:** `fade-down`
    -   **Purpose:** Provides an authoritative entrance, introducing the content below.
 
-   **Paragraphs & General Text (`p`, `div`):**
    -   **Default Animation:** `fade-up`
    -   **Purpose:** A classic, elegant effect that smoothly presents text to the reader.
 
-   **Cards, Images & Visual Blocks (`div.card`, `img`):**
    -   **Default Animation:** `zoom-in`
    -   **Purpose:** Gives visual elements a sense of depth and "pops" them forward for the user.
 
-   **List Items (`li`) inside a Staggered Container:**
    -   **Default Animation:** `slide-right`
    -   **Purpose:** Creates a clean, rhythmic cascade for lists of items.
 
-   **Special: Impact Bar Numbers:**
    -   **Animation:** Will use a custom JavaScript "count-up" function for a specialized effect.
    -   **Icons:** Will use their unique, custom SVG animations as previously specified (Pop-in, Pulse, etc.).
 
 ---
 
 ## 5. Button & Interactive Element Effects
 
 ### Primary Buttons (e.g., "Donate Now", "Subscribe")
 
 -   **Neutral State (Hero "Donate Now" ONLY):** A subtle "Glass Wipe" effect (a shiny glare) animates across the button every 5-7 seconds to draw attention.
 -   **Hover State (All Primary Buttons):** A "Subtle 3D Pop" effect combining:
     -   **Lift:** `transform: translateY(-6px) rotateX(3deg) rotateY(-2deg);`
     -   **Glow:** An enhanced `box-shadow`.
     -   **Transition:** `180ms cubic-bezier(.2,.8,.2,1)`.
 
 ### Secondary "Ghost" Buttons
 
 -   **Hover State:** The transparent background will fill with a solid color (e.g., white or a light blue tint), and the text color will change for contrast.
 
 ### Text Links with Arrows (e.g., "Read More →")
 
 -   **Hover State:** The arrow (`→`) will animate to appear longer by transitioning the `width` of a pseudo-element, creating a "stretching" effect.
 
 ### Form Input Fields
 
 -   **Focus State:** When a user clicks into a field, the border color will smoothly transition to `Primary Vivid Azure (#3aafed)`.
 
 ---
 
 ## 6. Component-Specific Animations
 
 ### Desktop Header (Navigation)
 
 -   **Dynamic Stickiness:** Hides on scroll down, reappears on scroll up. Adopts a "floating/detached" style when not at the top of the page.
 -   **Nav Link Hover:** A "Liquid Fill" effect where a `Primary Vivid Azure` background fills the link from bottom to top, and the text transitions to `White`.
 
 ### Mobile Header
 
 -   **Hamburger to Close Icon:** The icon's lines will perform a `405` degree rotation while the middle line fades out to form an 'X'.
 -   **Menu Open/Close:** The full-screen menu will fade and slide in from the top.
 -   **Submenu Accordion:** Submenus will slide down and fade in. Opening a new submenu will automatically close the previous one.
 
 ### Testimonial & News Card Hovers
 
 -   **Card Hover:** The entire card will "lift" (`translateY`) and gain a `box-shadow`.
 -   **Image Zoom:** The image within the card will simultaneously scale up slightly (`scale(1.05)`). The card must have `overflow: hidden`.
 
 ### Scroll Down Indicator (Hero)
 
 -   A continuous "shooting arrows" effect where multiple arrows sequence downwards and fade out in a loop.
 
 ---