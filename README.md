# ATELIER — Fashion & Lifestyle Website Template

![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Modular-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-Envato%20Commercial-4CAF50)
![Status](https://img.shields.io/badge/Status-ThemeForest%20Ready-brightgreen)

ATELIER is a commercial-grade editorial fashion and lifestyle website template engineered for independent labels, boutique storefronts, and contemporary lifestyle brands.

---

## Live Demo & Documentation
- **Live Production Preview:** [https://atelier-template.vercel.app](https://atelier-template.vercel.app)
- **Offline HTML Documentation:** [documentation/index.html](file:///c:/Programming/ATELIER%20%E2%80%94%20Fashion%20&%20Lifestyle%20Website%20Template/documentation/index.html)

---

## Included Page Layouts
1. **Home** (`template/index.html`) — Editorial campaign hero, collection chapters, new arrivals, manifesto, lookbook, and newsletter.
2. **Collections** (`template/collections.html`) — Three distinct seasonal editorial chapters.
3. **Shop** (`template/shop.html`) — Product catalog with category filtering and price/name sorting.
4. **Product Detail** (`template/product.html`) — Multi-view gallery, color & size selectors, quantity stepper, and demo cart drawer.
5. **Our Story** (`template/about.html`) — Brand manifesto, core values, and craftsmanship notes.
6. **Journal** (`template/journal.html`) — Field notes with editorial category filtering.
7. **Article** (`template/article.html`) — Long-form reading layout with pull quotes and author bio.
8. **Contact** (`template/contact.html`) — Global studio information and validated contact form.

---

## Quick Start
1. Unzip the downloaded archive.
2. Open `template/index.html` directly in any modern browser.
3. No build tools, package managers, or local server runtimes are required.
4. To run on a local HTTP port during development:
   ```bash
   # Using Python
   cd template && python -m http.server 8080

   # Or using Node
   npx serve template
   ```

---

## Customization Guide
- **Brand Info & Form Endpoints:** Edit `template/js/data/site-config.js` to update brand name, email, announcement banner, and form submission URLs.
- **Colors & Design Tokens:** Edit `:root` variables in `template/css/style.css` to customize palettes, fonts, and gutter sizes.
- **Images:** Replace WebP files in `template/assets/images/`. Update `srcset` and `alt` attributes in HTML accordingly.
- **Typography:** Playfair Display and DM Sans are bundled locally in `template/assets/fonts/` under the SIL Open Font License.

---

## Package Structure
```text
ATELIER/
├── template/         # Complete deployable website source
├── documentation/    # Offline interactive HTML documentation
├── marketplace/      # Envato listing copy, specifications, and search tags
├── preview/          # 2340x1560 covers and responsive screenshots
├── README.md         # Repository overview
├── CHANGELOG.md      # Version history and release notes
├── CREDITS.txt       # Asset and typography licensing attributions
├── LICENSE.txt       # Envato commercial license terms
└── START-HERE.txt    # Buyer onboarding guide
```

---

## License & Credits
- **Fonts:** Playfair Display & DM Sans (SIL Open Font License).
- **Photography:** Pexels Free License (cleared for commercial templates you sell).
- **Author:** TemplateFlux
