/**
 * Initializes testimonial sliders on the page.
 * This function sets up multiple sliders by attaching event listeners for navigation buttons,
 * pagination dots, autoplay, hover pause, and window resize handling.
 * It assumes a specific DOM structure with classes like .testimonial-slider, .slider__track, etc.
 * Each slider operates independently with its own state.
 *
 * @example
 * // Call this function after the DOM is loaded
 * initTestimonialSlider();
 */
export function initTestimonialSlider() {
     const sliders = document.querySelectorAll('.testimonial-slider'); 
 
     sliders.forEach(slider => { 
         const track = slider.querySelector('.slider__track'); 
         if (!track) return; 
 
         const slides = Array.from(track.children); 
         const wrapper = slider.closest('.testimonial-slider-wrapper'); 
         const nextButton = wrapper.querySelector('.slider__arrow--next'); 
         const prevButton = wrapper.querySelector('.slider__arrow--prev'); 
         const dotsNav = wrapper.parentElement.querySelector('.slider-pagination'); 
         const dots = dotsNav ? Array.from(dotsNav.children) : []; 
 
         if (slides.length === 0) return; 
 
         let currentIndex = 0; 
         let autoPlayInterval = null; 
 
         // --- Core Function to Move Slider ---
         /**
          * Moves the slider to the specified slide index.
          * Updates the track transform, active classes for slides and dots.
          * Ensures the target index is within bounds.
          *
          * @param {number} targetIndex - The index of the slide to move to.
          */
         const moveToSlide = (targetIndex) => {
             // Ensure the targetIndex is within bounds
             if (targetIndex < 0 || targetIndex >= slides.length) return;

             // Calculate the distance to move based on the container's width
             const amountToMove = targetIndex * 100;
             track.style.transform = `translateX(-${amountToMove}%)`;

             // Update active slide class
             slides[currentIndex]?.classList.remove('is-active');
             slides[targetIndex]?.classList.add('is-active');

             // Update active dot class
             if (dots.length > 0) {
                 dots[currentIndex]?.classList.remove('is-active');
                 dots[targetIndex]?.classList.add('is-active');
             }

             currentIndex = targetIndex;
         };
 
         // --- Autoplay ---
         /**
          * Starts the autoplay functionality, advancing slides every 7 seconds.
          * Clears any existing interval to prevent multiple timers.
          */
         const startAutoPlay = () => {
             stopAutoPlay(); // Prevent multiple intervals
             autoPlayInterval = setInterval(() => {
                 const nextIndex = (currentIndex + 1) % slides.length;
                 moveToSlide(nextIndex);
             }, 7000);
         };

         /**
          * Stops the autoplay functionality by clearing the interval.
          */
         const stopAutoPlay = () => {
             clearInterval(autoPlayInterval);
         };
 
         // --- Event Listeners --- 
         if (nextButton && prevButton) { 
             nextButton.addEventListener('click', () => { 
                 const nextIndex = (currentIndex + 1) % slides.length; 
                 moveToSlide(nextIndex); 
                 stopAutoPlay(); // Stop autoplay on manual interaction 
             }); 
 
             prevButton.addEventListener('click', () => { 
                 const prevIndex = (currentIndex - 1 + slides.length) % slides.length; 
                 moveToSlide(prevIndex); 
                 stopAutoPlay(); 
             }); 
         } 
 
         if (dotsNav) { 
             dotsNav.addEventListener('click', e => { 
                 const targetDot = e.target.closest('button'); 
                 if (!targetDot) return; 
 
                 const targetIndex = dots.findIndex(dot => dot === targetDot); 
                 if (targetIndex !== -1) { 
                     moveToSlide(targetIndex); 
                     stopAutoPlay(); 
                 } 
             }); 
         } 
         
         // Pause on hover 
         if (wrapper) { 
             wrapper.addEventListener('mouseenter', stopAutoPlay); 
             wrapper.addEventListener('mouseleave', startAutoPlay); 
         } 
 
         // Window resize listener to ensure slider stays aligned 
         window.addEventListener('resize', () => { 
              // This re-applies the transform without transition for an instant snap 
              track.style.transition = 'none'; 
              moveToSlide(currentIndex); 
              // Use a timeout to re-enable the transition after the snap 
              setTimeout(() => { 
                 track.style.transition = 'transform 0.5s ease-in-out'; 
              }, 50); 
         }); 
 
         // --- Initial Setup --- 
         track.style.transition = 'transform 0.5s ease-in-out'; 
         moveToSlide(0); // Set initial position 
         startAutoPlay(); 
     }); 
 }