# 📝 Idea Note (IDN) – NGO Elastic Masonry Gallery Prototype 

## 1. Concept  
An **image gallery page** for an NGO to showcase photo evidence of activities.  
The design blends:  
- **Masonry-style layout** (Pinterest-like, natural aspect ratios respected).  
- **Elastic scrolling effect** (columns move with lag/inertia, first and last columns move earliest).  
- **Overlay viewer** for focused image viewing.  
- **Liquid distortion transition** when switching main images.  

---

## 2. Prototype Core Features  
### Layout  
- Columns with **fixed width, dynamic height**.  
- Images keep original aspect ratio.  
- **Lazy loading** to improve performance.  

### Scrolling  
- Smooth + elastic feel using **GSAP ScrollSmoother** or equivalent.  
- Column-based lag:  
  - First & last columns = higher lag.  
  - Middle columns = lower lag.  
- Creates wave-like elastic scroll effect.  

### Overlay (Lightbox)  
- Clicking an image → dark overlay.  
- Layout in overlay:  
  - **Main image** left (large).  
  - **Side column** right with smaller images.  
- Metadata at bottom of main image.  

### Navigation in Overlay  
- Hover on side images → show description overlay.  
- Scroll snap on side column: when an image reaches the middle, it becomes the new main image.  
- Transition between main images uses **liquid distortion shader effect**.  

---

## 3. Accessibility & Performance Notes  
- **Accessibility**:  
  - Do not hijack native scroll.  
  - Respect OS “reduce motion” preferences.  
  - Alt text + semantic HTML for NGO photos and captions.  
- **Performance**:  
  - Use lazy loading + compression.  
  - Animate at column level, not individual images.  
  - Use IntersectionObserver to limit animations to visible elements.  

---

## 4. Next Steps (Prototype Roadmap)  
1. Implement **Masonry with fixed column width**.  
2. Add **GSAP ScrollSmoother lag** per column.  
3. Build **overlay viewer layout**.  
4. Integrate **scroll snap + liquid distortion shader** for transitions.  
5. Test **accessibility and performance** on mobile + low-end devices.