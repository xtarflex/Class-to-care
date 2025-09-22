# Documentation: The "Animate on View" System 
 
 This document explains the architecture of our lightweight, dependency-free animation system. It is designed to be a reference for understanding how the different parts (`HTML`, `CSS`, `JS`) work together. 
 
 --- 
 
 ## The Core Concept 
 
 The system's only job is to watch for elements and give them a pre-defined entrance animation when they appear on the screen for the first time. It is built on the principles of efficiency, accessibility, and ease of use. 
 
 --- 
 
 ## Part 1: The HTML (`index.html`) - The "What" 
 
 The HTML's role is to declare **WHAT** should be animated and **HOW** it should behave. We do this using simple `data-*` attributes, which act as instructions for our system. 
 
 -   **`data-ani`**: This is the primary trigger. Any element with this attribute will be animated. 
     -   You can specify an animation name: `data-ani="slide-left"`. 
     -   If left empty (`data-ani`), it will use the default animation ("fade-up"). 
 
 -   **Customization Attributes**: 
     -   `data-ani-delay="200"`: Sets a delay in milliseconds. 
     -   `data-ani-duration="900"`: Sets the animation duration in milliseconds. 
     -   `data-ani-easing="ease-in-out"`: Sets the CSS timing function. 
     -   `data-ani-once="false"`: Makes the animation replay every time it enters the screen (the default is `true`, animating only once). 
 
 -   **Staggering Children**: 
     -   `data-ani-stagger="100"`: When placed on a parent container, this applies an incremental 100ms delay to each direct child that also has a `data-ani` attribute, creating a cascade effect. 
 
 --- 
 
 ## Part 2: The CSS (`styles.css`) - The "How It Looks" 
 
 The CSS is the "art department." It contains all the visual rules and recipes for the animations. 
 
 -   **The "Before" State (`.will-animate`)**: This is the starting position for all animatable elements. By default, they are invisible (`opacity: 0`) and may be slightly transformed (e.g., moved down, scaled down). The JavaScript adds this class to prepare an element. 
 
 -   **The "Animation Recipes" (`@keyframes`)**: These are the named, step-by-step instructions for each animation. For example, `@keyframes ani-zoom-in` defines the visual steps for the "zoom-in" effect. 
 
 -   **The "Trigger" (`.is-inview`)**: This class is the magic switch. When the JavaScript adds `.is-inview` to an element, the CSS activates the appropriate `@keyframes` animation. It uses the `data-ani` attribute to match the element to the correct animation recipe. 
 
 --- 
 
 ## Part 3: The JavaScript (`animate-on-view.js`) - The "When" 
 
 The JavaScript is the "director" or "brain." It decides **WHEN** to trigger the animations. It uses a modern, high-performance browser API called `IntersectionObserver`. 
 
 -   **`IntersectionObserver`**: Think of this as a highly efficient "guard" that watches the browser viewport. We give it a list of all elements with `data-ani` to monitor. 
 
 -   **The Action**: The guard's only job is to notify our script the moment one of those elements scrolls into view. When it does, our script performs one simple action: it adds the `.is-inview` class to that element. 
 
 -   **The Handoff**: Once the class is added, the JavaScript's job is done for that element. The CSS automatically takes over and plays the beautiful animation we defined. 
 
 -   **Efficiency**: This method is incredibly performant because the browser is doing the hard work of watching the elements. Our script only has to react when the guard tells it to, instead of constantly checking the scroll position hundreds of times per second. 
 
 ### Summary of the Workflow 
 
 1.  **HTML**: We label elements with `data-ani` instructions. 
 2.  **JS**: The `IntersectionObserver` efficiently watches these elements. 
 3.  **JS**: When an element is visible, the script adds the `.is-inview` class. 
 4.  **CSS**: The `.is-inview` class triggers the correct `@keyframes` animation. 
 
 This clean separation of concerns makes our animation system powerful, performant, and easy to manage.