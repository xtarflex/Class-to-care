# Website Design Specifications & Handoff Notes

This document contains the technical details, animation specs, and interaction notes that complement the visual mockups. It serves as a guide for the development phase.

---

## **Component: Desktop Header**

**File:** `mockups/header-desktop.png`

### **1. General Layout & Styling**

-   **Background:** White (`#FFFFFF`).
-   **Bottom Border:** A subtle, 1px solid border with a light grey color (e.g., `#dee2e6`) to separate the header from the page content.
-   **Structure:** A flexible container (`display: flex`) with `justify-content: space-between` to push the logo to the left and the navigation/button group to the right.

### **2. Navigation Links (`<nav>`)**

-   **Font:** `Nunito`.
-   **Default State:**
    -   Text Color: `Neutral Dark Grey (#343a40)`.
-   **Active State (Current Page):**
    -   Text Color: `Primary Vivid Azure (#3aafed)`.
    -   Indicator: A 2px solid `border-bottom` using the same primary blue color.
-   **Hover State & Animation (Liquid Fill Effect):**
    -   **Trigger:** On hover.
    -   **Animation:** A solid background color fills the link from bottom to top.
    -   **Fill Color:** `Primary Vivid Azure (#3aafed)`.
    -   **Text Color Transition:** The link's text color must smoothly transition to `White (#FFFFFF)` as the blue background fills in to ensure constant readability.
    -   **Implementation:** Use CSS Transitions with a `cubic-bezier` timing function for a dynamic overshoot and settle effect. For example:
    ```css
    nav a::before {
      /* ... existing properties ... */
      transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    ```
    The `cubic-bezier` values (0.68, -0.55, 0.27, 1.55) create a spring-like animation curve that initially accelerates quickly, overshoots the target position, and then smoothly returns to the final state, producing a more organic liquid movement.

### **3. "DONATE" Button (`<a>` styled as a button)**

-   **Font:** `Montserrat`, bold, uppercase.
-   **Styling:**
    -   Background Color: `Primary Vivid Azure (#3aafed)`.
    -   Text Color: `White (#FFFFFF)`.
    -   Corners: A subtle `border-radius` (e.g., `4px` to `6px`) for a soft, modern look.
-   **Hover Effect:**
    -   The button should have a satisfying micro-interaction on hover.
    -   **Recommendation:** A slight "lift" effect using `transform: translateY(-2px)` and a subtle `box-shadow`, OR a brightness increase using `filter: brightness(1.1)`.
-   **Neutral State Animation**
    - **Neutral State Animation (Glass Wipe):** To draw attention to the primary CTA, the button will have a subtle, shiny "glare" that wipes across it from left to right every 5-7 seconds.    

### **4. Submenu Overlay (Mega Menu)**

-   **Trigger:** On hover over a navigation link with a dropdown (e.g., "About Us").
-   **Animation:** The overlay div slides down smoothly from underneath the header. Implement with a `CSS Transition` on `transform` and `opacity`.
-   **Styling:**
    -   Background Color: `Neutral Light Grey (#f8f9fa)`.
    -   Shadow: A soft, subtle `box-shadow` on the bottom edge to create a sense of depth and separation from the page content.
-   **Links within Overlay:**
    -   Follow the same default and hover state rules as the main navigation links for consistency.

### **5. Dynamic Behavior (Scroll-based)**

-   **Behavior:** The header is not fixed. It will disappear when the user scrolls down and reappear when the user scrolls up.
-   **Implementation:** This can be achieved using JavaScript to detect scroll direction and apply CSS classes (e.g., `hidden`, `visible`) to the header element, transitioning its `transform` (e.g., `translateY(-100%)` for hidden, `translateY(0)` for visible) and `opacity`.

### **6. Accessibility**

-   The entire header must be contained within a semantic `<header>` tag.
-   The navigation must use `<nav>`, `<ul>`, `<li>`, and `<a>` tags correctly.
-   Dropdown menus must be implemented with the appropriate `ARIA attributes` (`aria-haspopup`, `aria-expanded`) to be accessible to screen readers.

---
---

## **Component: Mobile Header & Menu**

**File:** `mockups/header-mobile.png`

### **1. Sticky & Dynamic Behavior (On Scroll)**

-   **Functionality:** The header will be "dynamically sticky."
-   **Scrolling Down:** When the user scrolls down the page, the header will smoothly slide up and out of view to maximize content visibility.
-   **Scrolling Up:** As soon as the user begins scrolling up (even by a small amount), the header will slide back into view.
-   **"Detached" State:** When the header is visible but the user is *not* at the absolute top of the page, it will have a "floating" or "detached" style:
    -   It will not be full-width; it will have a small margin on the left and right.
    -   It will have a subtle `border-radius` to appear like a rounded "pill."
    *   It will have a soft `box-shadow` to give it a sense of depth.
-   **"Top" State:** When the user scrolls all the way to the top of the page, the header will seamlessly revert to its full-width, sharp-cornered, no-shadow state.
-   **Implementation:** Requires a JavaScript scroll event listener to track scroll direction and add/remove a CSS class (e.g., `.header--scrolled`) to apply these styles.

### **2. Hamburger / Close Icon Animation**

-   **Trigger:** On tap of the hamburger icon.
-   **Animation:** The top and bottom lines of the hamburger icon will animate to form an 'X'.
    -   The middle line will fade out (`opacity: 0`).
    -   The top and bottom lines will rotate `405` degrees (360 + 45) to their final positions.
-   **Implementation:** Use CSS Transitions on the `transform` and `opacity` properties of the icon's elements.

### **3. Full-Screen Menu Interaction**

-   **Menu Animation:** On opening, the full-screen menu overlay will animate in.
    -   **Effect:** A combination of `opacity` (from 0 to 1) and `transform: translateY()` (e.g., sliding in from the top) for a smooth fade-and-slide effect.
-   **Submenu Behavior (Accordion):**
    -   **Trigger:** On tap of a parent menu item with a dropdown (e.g., "About Us").
    -   **Animation:** The submenu items will slide down and fade in (`opacity` and `translateY`).
    -   **Logic:** Only one submenu can be open at a time. Tapping another parent item will automatically close the previously opened one before opening the new one.
-   **Implementation:** Requires JavaScript to toggle "active" classes on the menu items and handle the accordion logic.

---
---

## **Component: Footer**

**File:** `prototype/footer-desktop.png`

### **1. General Layout & Styling**

-   **Structure:** A multi-section footer with a main content area, a newsletter signup area, and a final copyright bar.
-   **Color Implementation Note:** The prototype's colors will be replaced during development. The final implementation will use `Neutral Dark Grey (#343a40)` for the background and `White (#FFFFFF)` for text, with `Primary Vivid Azure (#3aafed)` for link hovers and button backgrounds, as defined in `brand_identity.md`.

### **2. Main Content Area (4-Column Layout)**

-   **Column 1 (Organization):**
    -   Will use the official Class to Care logo.
    -   Will feature the updated, approved mission summary text.
    -   Will include social media icons.
-   **Column 2 (Quick Links):**
    -   Links will be updated to reflect the final sitemap (`Home`, `About Us`, `Our Work`, etc.).
-   **Column 3 (Get Involved):**
    -   Links for primary user actions (`Donate Now`, `Volunteer`, etc.).
-   **Column 4 (Contact Info):**
    -   Will use the official, client-approved contact details.
    -   Icons will be used for location, email, and phone for better visual parsing.

### **3. "Stay Updated" (Newsletter Signup)**

-   **Icon:** A relevant icon (like the one prototyped) will be placed next to the "Stay Updated" headline to draw visual interest.
-   **Functionality:** This will be a functional form that integrates with a service like Mailchimp or Formspree to collect user emails.

### **4. Social Media Icon Interaction**

-   **Hover Animation:** On hover, the social media icons will smoothly transition from the default monochrome style to their official brand colors (e.g., Facebook blue, Instagram gradient). This provides a delightful micro-interaction.

### **5. Copyright & Legal Bar**

-   **Content:** Will include the current year, official organization name, and links to "Privacy Policy" and "Terms of Service" pages.
-   **Layout:** Uses `display: flex` with `justify-content: space-between` to correctly position the copyright on the left and legal links on the right.

### **6. Mobile Responsiveness**

-   On mobile viewports, the 4-column layout will collapse and stack vertically into a single column for readability.

---
---
## **Component: Hero Section**

**File:** `mockups/hero-desktop.png`

### **1. Visuals & Layout**

-   **Background:** A single, high-impact, authentic photo.
-   **Overlay:** The "Trustworthy Sky" gradient (`linear-gradient(to right, #aafed, #3a7bd5)`) will be applied with a 70-80% opacity to ensure text readability.
-   **Photo Strip (Bottom Right):**
    -   A creative, diagonal strip of smaller photos.
    -   **Visual Treatment:** The photos in the strip will have a semi-transparent **grayscale (black and white) filter** applied to reduce their visual weight and prevent them from distracting from the main headline.
-   **Scroll Down Indicator:** 
    -   Position: Bottom-center of the hero section
    -   Animation: 
        -   Multiple arrows appear in sequence
        -   Each arrow moves downward while simultaneously fading out
        -   When fully transparent, instantly resets to starting position
        -   Creates continuous "shooting arrows" effect
        -   Animation timing: 1.5s loop duration
        -   Uses CSS keyframes for smooth motion and opacity transition

### **2. Typography**

-   **Main Headline (H1):** "Improving Healthcare, Saving Lives In Nigeria."
    -   Font: `Montserrat`, Bold (700).
    -   Color: `White (#FFFFFF)`.
-   **Sub-headline (p):** "We improve healthcare service delivery..."
    -   Font: `Nunito`, Regular (400).
    -   Color: `White (#FFFFFF)`.

### **3. Call-to-Action Buttons**

-   **Primary Button:**
    -   Text: "Donate Now >>"
    -   Style: Solid fill.
    -   Background: `Primary Vivid Azure (#3aafed)`.
    -   Hover Effect:
        -   The ">>" icons animate with a shooting effect
        -   Animation combines horizontal movement and fade-out
        -   Triggers only on hover state
        -   Duration: 1.5s loop while hovering
        -   Uses ease-out timing for smooth motion
    -   **Neutral State Animation (Glass Wipe):** 
        -   To draw attention to the primary CTA, the button will have a subtle, shiny "glare" that wipes across it from left to right every 5-7 seconds.    
        -   Animation:
            -   The button will have a `linear-gradient` animation that moves from left to right
            -   The animation will be 0.5s duration
            -   The animation will be repeated 3 times
            -   The animation will be delayed 1s

-   **Secondary Button:**
    -   Text: "See Our Work >>"
    -   Style: Ghost button (outline).
    -   Border: `2px solid #FFFFFF`.
    -   Hover Effect:
        -   Matching ">>" shooting animation on hover
        -   Identical timing and motion as primary button
        -   Creates consistent interaction pattern

### **4. Entrance Animation (On Page Load)**

-   **Choreography:** A staggered "fade-and-slide-in" cascade effect.
-   **Sequence:**
    1.  Main Headline fades/slides in.
    2.  Sub-headline fades/slides in (`animation-delay: 0.2s`).
    3.  Both CTA buttons fade/slide in together (`animation-delay: 0.4s`).
    4.  The Photo Strip slides in from the bottom right with a **longer delay (`animation-delay: 0.8s`)** to ensure it's the last element to draw attention.

---
---

## **Component: Impact Bar**

**File:** `mockups/impact-bar.png`

### **1. General Layout & Styling**

-   **Background:** `Neutral Light Grey (#f8f9fa)` to separate it from surrounding sections.
-   **Layout (Desktop):** A four-column layout, evenly spaced.
-   **Layout (Mobile):** Collapses to a two-by-two grid to maintain readability.
-   **Note:** The mockup shows the first icon in blue; the final implementation will use `Primary Vivid Azure (#3aafed)` for the first icon and `Neutral Dark Grey (#343a40)` for the other three icons for visual variety, as shown in the design.

### **2. Typography & Content**

-   **Statistic (Number):** `Montserrat`, Bold (700). Color: `Neutral Dark Grey (#343a40)`.
-   **Label (Title):** `Nunito`, Bold (700).
    -   **Default Color:** `Neutral Dark Grey (#343a40)`.
    -   **Highlight Color:** The final, most impactful word of each label (e.g., "Trained," "Supported") is highlighted using `Secondary Leaf Green (#8CC63F)`. This is a key design feature.
-   **Description (Paragraph):** `Nunito`, Regular (400). Color: `Neutral Dark Grey (#343a40)`.
### **3. Interaction & Animation**

-   **On Scroll (Entrance Animation):**
    -   Triggered by the Intersection Observer API as the section enters the viewport.
    -   **Number Counter:** The numbers will animate, counting up from 0 to the final value.
    -   **Icon Animations:** Each icon will have its own unique entrance animation as previously specified (Pop-in, Pulse, Tassel Swing, Check Mark Draw).
-   **On Hover Interaction:**
    -   When a user hovers over an entire column (the container for the icon, number, and text), it will receive a subtle `box-shadow` and "lift" slightly (`transform: translateY(-4px)`).
    -   This provides clear, satisfying feedback to the user.

---
---

## **Component: "Our Work" Section**

**File:** `mockups/our-work.png`

### **1. General Layout & Styling**

-   **Background:** White (`#FFFFFF`).
-   **Introduction:** Features a "pill" button (`Our Work In Action`) and a main H2 title ("Our **Work**") with the "Trustworthy Sky" gradient applied to the word "Work".
-   **Structure:** A three-column layout on desktop, collapsing to a single column on mobile. Each column is a styled "card" with a light border, subtle box-shadow, and rounded corners.

### **2. Card Content Styling**

-   **Icon Color:** `Neutral Dark Grey (#343a40)`.
-   **Title (H3) Color:** `Neutral Dark Grey (#343a40)`.
-   **Paragraph Color:** `Neutral Dark Grey (#343a40)`.
-   **"Learn More" Link:**
    -   **Text & Arrow Color:** `Secondary Leaf Green (#8CC63F)`.

### **3. Interaction & Animation**

-   **On Scroll (Entrance Animation):**
    -   As the section enters the viewport, the three cards will animate in with a staggered "fade-and-slide-up" effect.
-   **"Learn More" Link Hover Animation:**
    -   **Trigger:** On hover over the "Learn More" link.
    -   **Effect:** The arrow (`→`) will animate to appear longer, as if it is stretching out.
    -   **Implementation:** This can be achieved by transitioning the `width` of a pseudo-element (`::after`) that creates the arrow's horizontal line. This is NOT a `transform: translateX`.
    -   **Timing:** A quick, satisfying `0.3s` `ease-out` transition.

---
---

## **Component: Testimonials Section**

**File:** `mockups/testimonials.png`

### **1. General Layout & Content Strategy**

-   **Structure:** A slider/carousel that displays one testimonial at a time.
-   **Content Goal:** The carousel will feature 3-4 curated testimonials, each representing a core pillar of Class to Care's work (e.g., Equipment Donation, Medical Education, Public Awareness).
-   **Background:** White (`#FFFFFF`).
-   **Section Title (H2):** "What Our Partners **Say**" (with "Trustworthy Sky" gradient on "Say").

### **2. Single Testimonial Slide Design**

-   **Container:** A styled card with an Accent (Vivid Magenta) (#b15d9b) border and soft rounded corners.
-   **Quote Icon:** A large, stylized quotation mark icon (`"`) at the top left of the quote.
    -   **Color:** `Primary Vivid Azure (#3aafed)`.
-   **Headline (H3):** A short, impactful, emotional headline summarizing the story (e.g., "Knowledge That Saves Lives").
    -   **Font:** `Montserrat`, Bold.
-   **Testimonial Text (Blockquote):** The main quote from the individual.
    -   **Font:** `Nunito`, Italic.
-   **Divider:** A short, horizontal line below the quote.
-   **Attribution (Name & Title):**
    -   **Font:** `Montserrat`, Bold for the name; `Nunito`, Regular for the title/context.
-   **Author Image:** A circular frame for a photo of the person giving the testimonial.

### **3. Carousel Navigation & Interaction**

-   **Functionality:** The carousel will combine three navigation methods for optimal user experience.
-   **1. Automatic Sliding:**
    -   The slides will automatically transition every 5-7 seconds.
    -   The auto-play will **pause on user hover** to allow for comfortable reading.
-   **2. Arrow Navigation:**
    -   Clear `<` and `>` arrow icons will be present on the left and right for manual control.
-   **3. Pagination Dots:**
    -   A series of small, clickable circle indicators will be centered below the testimonial card.
    -   The active dot will be styled with `Primary Vivid Azure (#3aafed)`.
    -   Inactive dots will be a light grey.

---
---

## **Component: "Latest News" Section**

### **1. General Layout & Styling**

-   **Structure:** A three-column grid of article cards on desktop, stacking to a single column on mobile.
-   **Section Title (H2):** "Latest **News**" with the "Trustworthy Sky" gradient on "News".

### **2. Article Card Design**

-   **Image:** Placeholder for a real event photo.
-   **Category Tag:** A "pill" button styled with `Secondary Leaf Green (#8CC63F)`.
-   **Headline (H3):** `Montserrat`, Bold.
-   **Excerpt (p):** `Nunito`.
-   **"Read More" Link:** Text link styled with `Primary Vivid Azure (#3aafed)`.

### **3. Interaction & Animation**

-   **On Scroll (Entrance Animation):** The three article cards will animate in with a staggered "fade-and-slide-up" effect.
-   **Card Hover Effect:**
    -   The entire card will "lift" (`transform: translateY(-5px)`) and gain a `box-shadow`.
    -   The card's image will "zoom" in slightly (`transform: scale(1.05)`).
-   **"Read More" Hover Effect:** The arrow (`→`) will "stretch" in length on hover.
---
---

## **Component: Newsletter Section**

**File:** `mockups/newsletter.png`

### **1. General Layout & Styling**

-   **Background:** Uses the "Trustworthy Sky" gradient (`linear-gradient(to right, #3aafed, #3a7bd5)`). A subtle, repeating dotted pattern is overlaid on top of the gradient to add texture and depth.
-   **Structure:** A self-contained call-to-action block with rounded corners.
-   **Icon:** A clean icon representing a newsletter or document.
-   **Typography:** `Montserrat` for the headline and `Nunito` for the paragraph. All text is `White (#FFFFFF)`.

### **2. Form Elements & Interaction**

-   **Input Field:**
    -   **Style:** A clean, modern input with a subtle border.
    -   **On Focus:** The border will change color to our `Secondary Leaf Green (#8CC63F)` to provide clear visual feedback.
-   **Subscribe Button:**
    -   **Style:** A solid-fill button to provide a strong call-to-action.
    -   **Background Color:** `Neutral Dark Grey (#343a40)`.
    -   **Text Color:** `White (#FFFFFF)`.
    -   **On Hover:** Will use our standard button hover effect ("lift," "glow," "brightness pop").
---
---
# Technical Details & Best Practices

This document outlines the technical specifications and implementation details for non-page-specific features of the Class to Care website.

---

## 1. State Pages (404, Offline, Errors)

A consistent design template will be used for all user-facing state pages to ensure a helpful and on-brand experience.

### **Common Structure:**
-   All state pages will include the standard Global Header and Global Footer.
-   The main content area will feature a large headline, a helpful descriptive paragraph, and a primary call-to-action button linking back to the Homepage.

### **Specific Pages:**
-   **404 Page Not Found:**
    -   **Visual:** Will feature the approved "fork in the road" illustration.
    -   **Headline:** "Oops! Page Not Found"
-   **Offline Page:**
    -   **Visual:** Will feature the approved "broken plug" illustration.
    -   **Headline:** "You Are Currently Offline"
    -   **Message:** "Please check your internet connection and try again."
-   **General Error Page:**
    -   **Visual:** Will feature the approved "friendly robot mechanic" illustration.
    -   **Headline:** "Something Went Wrong"
    -   **Message:** "Our team is on it! Please try again later or contact us if the problem persists."

---

## 2. Favicon

-   A full set of favicon files will be generated using the Real Favicon Generator.
-   The icon will be a simplified version of the Class to Care logo for clarity at small sizes.

---

## 3. SEO Meta Tags

-   Every page will have a unique and descriptive `<title>` tag and `<meta name="description">` tag to ensure optimal visibility on search engines.

---

## 4. Performance Optimization

-   All images will be compressed and served in a modern format (e.g., WebP) where possible.
-   CSS and JavaScript files will be minified before launch.
-   The site's performance will be benchmarked using Google's PageSpeed Insights.

---