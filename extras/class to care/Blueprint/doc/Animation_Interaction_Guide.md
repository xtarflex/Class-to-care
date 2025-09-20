# Class to Care: Website Animation & Interaction Guide
 
 This document is the single source of truth for all animation, transition, and micro-interaction specifications for the website. It serves as a blueprint for the development phase to ensure a consistent and high-quality user experience.
 
 ---
 
 ## 1. Global Principles
 
 -   **Framework:** All animations will be implemented using modern, performant CSS (`Transitions`, `Transforms`, `@keyframes`) where possible.
 -   **Triggering:** On-scroll animations will be triggered using the JavaScript **Intersection Observer API** for optimal performance.
 -   **Timing:** Standard transitions will use a duration of `0.3s` with an `ease-out` timing function for a smooth and responsive feel, unless otherwise specified.
 
 ---
 
 ## 2. On-Page Load Animations
 
 ### Hero Section Entrance
 
 -   **Choreography:** A staggered "fade-and-slide-up" cascade effect on page load.
 -   **Sequence & Delay:**
     1.  Main Headline (`0s delay`)
     2.  Sub-headline (`0.2s delay`)
     3.  CTA Buttons (`0.4s delay`)
     4.  Photo Strip (`0.8s delay`)
 
 ---
 
 ## 3. On-Scroll Entrance Animations
 
 This standard "fade-and-slide-up" effect will be applied to sections and elements as they enter the viewport.
 
 -   **Impact Bar:**
     -   **Numbers:** A "count-up" animation from 0 to the final value.
     -   **Icons:** Each of the four icons has a unique, custom animation:
         -   `Users`: Gentle Pop-in (scale and fade).
         -   `FirstAidKit`: Supportive Pulse (fade in, then pulse the cross).
         -   `GraduationCap`: Tassel Swing (fade in, then swing the tassel).
         -   `CalendarCheck`: Check Mark Draw (fade in, then draw the check mark).
 -   **"Our Work" Section:** The three content cards will stagger in using the standard fade-and-slide-up effect.
 -   **Testimonials Section:** The entire slider component will fade and slide up.
 -   **"Latest News" Section:** The three article cards will stagger in using the standard fade-and-slide-up effect.
 -   **Newsletter Section:** The content will fade and slide up as a single block.
 
 ---
 
 ## 4. Button & Interactive Element Effects
 
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
 
 ## 5. Component-Specific Animations
 
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