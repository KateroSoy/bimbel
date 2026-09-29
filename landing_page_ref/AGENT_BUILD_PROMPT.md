# AI Agent Build Prompt — LearnSpace+ Visual UI

You are a senior product designer + frontend engineer. Recreate the supplied education landing-page UI with very high visual fidelity, using the files in this pack as the single visual source of truth.

## Files to inspect first
- `references/00_full_page_highres.png`
- `references/01_header_hero_promo_programs.png`
- `references/02_packages_course_search_cards.png`
- `references/03_digital_products_cta_facilities_testimonial.png`
- `references/04_trust_logos_social_media.png`
- `references/05_faq_app_promo_footer.png`
- `assets/named/`
- `CONTENT_SOURCE.md`
- `ui_blueprint.json`
- `design_tokens.json`

## Goal
Build a polished, responsive education website UI that follows the reference's visual language:
- clean white background
- strong navy primary color
- orange accent for primary emphasis and active chips
- red/pink promotional accents
- rounded cards with thin light borders
- restrained shadows
- compact educational marketplace cards
- large whitespace and clear vertical rhythm
- professional Indonesian education brand feel

The screenshot branding is StudyHack. The written source also references LearnSpace+ and SekolahVerse. Use the requested target brand/content from the source requirements while preserving the visual composition.

## Non-negotiable visual rules
1. Do not redesign the page into a different visual style.
2. Do not add glassmorphism, neon gradients, dark-mode sections, huge shadows, or generic AI-generated UI decoration.
3. Keep desktop proportions close to the supplied reference.
4. Use the same hierarchy: small top utility bar → navigation → hero → promotion → programs → package pricing → course material search/cards → digital products → consultation CTA → facilities/testimonial → trust/logos → social media → FAQ/closing CTA/footer.
5. Use supplied images/assets whenever possible. If an image must be replaced, preserve subject, crop ratio, brightness, and composition.
6. Buttons should be pill/rounded, compact, and visually close to the reference.
7. Borders should stay subtle and light; avoid heavy outlines.
8. Text should stay compact. Do not inflate headings or spacing beyond the reference.

## Required page structure
### 1. Utility strip + header navigation
Create a slim navy top strip with contact information and a CTA area. Under it, use a white sticky/navigation header with logo left, centered/right navigation, search/login/CTA actions as needed by the source.

Target navigation content from source:
- Beranda
- Karir
- LearnSpace+
- Produk Digital
- Program Belajar
- Tentang Kami
- Tahunan
- Login should lead to SekolahVerse where applicable.

### 2. Hero
Use the same split hero composition as the visual reference: left-aligned headline/copy/actions/statistics, right-side student imagery arranged in angular/segmented image panels.

Core source message:
- “THE BEST PLACE TO BOOST YOUR BRAIN”
- “Tempat belajar untuk mengasah kemampuan, membangun kepercayaan diri, dan mengembangkan potensi terbaik setiap anak.”

### 3. Promotions
Implement promotion cards/carousel using the three source promotions in `CONTENT_SOURCE.md`. Visually follow the wide soft-red promo block in the reference.

### 4. Program Belajar
Create filter chips and responsive program cards. Include the source programs and pricing from `CONTENT_SOURCE.md`.

### 5. Pilihan Paket
Create three horizontally aligned pricing cards on desktop and stacked cards on mobile. Use the source packages COMBO, SUPER and INTENSIF. Give the center/recommended package stronger emphasis similar to the reference.

### 6. Kursus per Materi / Search
Recreate the pill-filter search bar from `assets/named/search_filter_bar.png`.
Required filters:
- Jenjang: SD, SMP, SMA
- Mata Pelajaran
- Kurikulum: Nasional, Nasional Plus, Cambridge, Singapore, IB
- Materi: e.g. Trigonometri, Aljabar

Behavior:
- random/default material cards may appear before search
- after a user searches, show courses matching selected filters

Use the supplied course-card references for card structure: subject tag, image, rating/student count, course title, tutor, divider, red/orange price and “Daftar →”.

### 7. Produk Digital
Use the supplied wide digital-product visual as layout reference. Source requirement says digital-product payment connects to Lynk and is separate from the bimbel payment system. Keep the section visually integrated with the main site but treat checkout flow separately.

### 8. Consultation CTA + About/Facilities/Testimonial
Recreate the navy consultation bar, facilities icon row, four-image facility gallery, testimonial card and rating card composition. The source includes a “Tentang Kami” section; adapt this visual block to satisfy that requirement while preserving the reference layout.

### 9. Trust + social proof
Use the school-logo strip and partner/logo strip as supplied visual assets. Follow with the 4-column social-media cards shown in the reference.

### 10. FAQ + closing CTA + footer
Use accordion FAQ styling with strong red rows and compact plus icons. Preserve the overall footer composition from the reference. If a mobile-app download CTA is not part of actual project scope, use it only as a visual composition reference and replace it with a product-appropriate closing CTA rather than inventing an app requirement.

## Responsive behavior
- Desktop: max content width about 1180–1240 px; center aligned.
- Tablet: 2-column cards where practical.
- Mobile: single-column sections, horizontal chip scrolling, stacked pricing cards, course cards 1-column or 2-column depending on width.
- Navigation collapses into a clean mobile menu.
- Keep touch targets at least 44px high.
- Images must not distort.

## Suggested implementation quality bar
- reusable components
- semantic HTML
- responsive CSS/Tailwind
- consistent spacing tokens
- accessible focus states
- keyboard-accessible accordion/filter controls
- no layout shift from images
- optimized image loading
- Lighthouse-friendly implementation

## Acceptance criteria
Before declaring complete:
1. Compare the implementation side-by-side with each `references/01...05...png` crop.
2. Verify section order matches the full-page reference.
3. Verify source prices/copy match `CONTENT_SOURCE.md`.
4. Verify desktop, tablet, and mobile layouts.
5. Verify no generic AI-style visual drift.
6. Verify supplied local assets are used where suitable.
7. Verify course search/filter interaction and FAQ accordion work.
8. Verify the digital-product payment path is visually separated from bimbel checkout as specified.

Deliver the finished implementation, not a conceptual mockup.
