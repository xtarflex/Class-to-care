/**
 * @file story-reveal.js
 */

export function initStoryReveal() {
    const blobText = document.getElementById('dynamic-blob-text');
    const step1 = document.getElementById('story-step-1');
    const step2 = document.getElementById('story-step-2');
    const scrollHeadline = document.getElementById('scroll-headline');
    const storyParagraphs = document.querySelectorAll('.story-step p');

    if (!blobText || !step1 || !step2) return;

    // --- 1. Blob Text Logic ---
    if (window.innerWidth >= 992) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let newText = entry.target.id === 'story-step-1' ? "What You See" : "What You Need To Know";
                    if (blobText.textContent !== newText) {
                        blobText.classList.add('text-fading');
                        setTimeout(() => {
                            blobText.textContent = newText;
                            blobText.classList.remove('text-fading');
                        }, 400);
                    }
                }
            });
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
        observer.observe(step1);
        observer.observe(step2);
    } else {
        blobText.textContent = "Our Reality";
    }

    // --- 2. Headline Word-by-Word Scroll Logic ---
    if (scrollHeadline) {
        // Function to wrap words recursively to preserve nested elements
        const wrapWords = (el) => {
            const nodes = Array.from(el.childNodes);
            el.innerHTML = '';
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const words = node.textContent.split(/(\s+)/);
                    words.forEach(word => {
                        if (word.trim()) {
                            const span = document.createElement('span');
                            span.className = 'headline-word';
                            span.textContent = word;
                            el.appendChild(span);
                        } else {
                            el.appendChild(document.createTextNode(word));
                        }
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    wrapWords(node);
                    el.appendChild(node);
                }
            });
        };

        wrapWords(scrollHeadline);
        const headlineWords = Array.from(scrollHeadline.querySelectorAll('.headline-word'));

        const handleScroll = () => {
            const rect = scrollHeadline.getBoundingClientRect();
            const vpHeight = window.innerHeight;

            // Calculate ratio (1 at bottom, 0 at top)
            const ratio = rect.top / vpHeight;

            // Start color change at 0.7 (30% from bottom) and stop at 0.5 (middle)
            const start = 0.9;
            const end = 0.65;

            let progress = (start - ratio) / (start - end);
            progress = Math.max(0, Math.min(1, progress));

            // Map progress to word indices
            const activeCount = Math.floor(progress * headlineWords.length);

            headlineWords.forEach((wordElement, index) => {
                const parent = wordElement.closest('.highlight-privilege');
                if (index < activeCount) {
                    // Turn on color (Azure for normal, Red for privilege)
                    wordElement.style.color = parent ? 'var(--accent-urgent-red)' : 'var(--primary-vivid-azure)';
                } else {
                    // Back to neutral-dark semi-transparent (handled by CSS, but clear inline)
                    wordElement.style.color = '';
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- 3. Paragraph In-View Trigger (for Draw Highlights) ---
    const paragraphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
            }
        });
    }, { threshold: 0.9 });

    storyParagraphs.forEach(p => paragraphObserver.observe(p));
}