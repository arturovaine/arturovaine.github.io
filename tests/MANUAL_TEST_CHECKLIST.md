# Manual Test Checklist - Metaproject Page

## Pre-test Setup
- [ ] Clear browser cache and localStorage
- [ ] Test in incognito/private mode for fresh state
- [ ] Have both desktop and mobile device ready

---

## 1. Page Load & Components

### Initial Load
- [ ] Page loads without console errors
- [ ] All components render correctly
- [ ] Lucide icons display properly
- [ ] Fonts load correctly (Inter, JetBrains Mono)

### Header
- [ ] Header is fixed at top
- [ ] Header has backdrop blur effect
- [ ] "Portfolio" back link is visible
- [ ] Navigation links are visible (Architecture, Diagrams, Tech Stack, Performance)
- [ ] Theme toggle button is visible
- [ ] GitHub link is visible (desktop only)
- [ ] Mobile menu button appears on small screens

---

## 2. Navigation

### Desktop Navigation
- [ ] Clicking "Architecture" scrolls to section
- [ ] Clicking "Diagrams" scrolls to section
- [ ] Clicking "Tech Stack" scrolls to section
- [ ] Clicking "Performance" scrolls to section
- [ ] Smooth scroll animation works
- [ ] Active nav link is highlighted while in section

### Mobile Navigation
- [ ] Hamburger menu opens mobile nav
- [ ] Mobile nav links work correctly
- [ ] Menu closes after clicking a link
- [ ] Menu closes when clicking outside

### Scroll Behavior
- [ ] Sections are not hidden under fixed header
- [ ] Scroll-to-top button appears after scrolling
- [ ] Scroll-to-top button scrolls smoothly to top

---

## 3. Theme Toggle

### Dark Theme (Default)
- [ ] Background is dark (#0a0a0a)
- [ ] Text is light colored
- [ ] Cards have dark backgrounds
- [ ] Code blocks have proper contrast

### Light Theme
- [ ] Toggle button switches theme
- [ ] Background becomes white
- [ ] Text becomes dark
- [ ] Cards adapt to light theme
- [ ] Code blocks stay dark for contrast
- [ ] Performance detail panel is light
- [ ] Code snippets inside detail panel are dark

### Persistence
- [ ] Theme persists after page reload
- [ ] No flash of wrong theme on load

---

## 4. Architecture Section

### Cards
- [ ] Three main cards display (index.html, main.js, ComponentLoader)
- [ ] Cards have correct icons and colors
- [ ] Hover effects work

### Component Loading Strategy
- [ ] Four strategy cards display
- [ ] Correct loading priorities shown

### Data Renderers Table
- [ ] Table displays correctly
- [ ] All 8 renderers listed
- [ ] Table scrolls horizontally on mobile

---

## 5. ASCII Diagrams

### System Overview
- [ ] Diagram renders correctly
- [ ] Colors display properly in dark theme
- [ ] Colors display properly in light theme
- [ ] Monospace font (JetBrains Mono) is applied

### Data Flow
- [ ] Diagram alignment is correct
- [ ] All renderers listed

### Project Structure
- [ ] File tree displays correctly
- [ ] Syntax highlighting works

### CSS Architecture
- [ ] Import structure shows correctly
- [ ] File names have proper colors

---

## 6. Tech Stack Section

### Tech Cards
- [ ] Six tech cards display (JS, Tailwind, Three.js, Lucide, GitHub Pages, GCS)
- [ ] Cards have proper icons
- [ ] "Why" explanations are visible
- [ ] Hover effects work

---

## 7. Performance Grid

### Grid Display
- [ ] 16 optimization items in grid
- [ ] 8 columns on desktop, 4 on mobile
- [ ] Icons and labels display correctly
- [ ] Color coding by category (blue, purple, cyan, orange)

### Filter Buttons
- [ ] 5 filter buttons visible (All, Loading, Assets, Rendering, CSS)
- [ ] Counters show correct numbers
- [ ] "All" is active by default
- [ ] Clicking filter shows only that category
- [ ] Filter animation is smooth
- [ ] Active filter is highlighted

### Detail Panel
- [ ] Clicking item opens detail panel
- [ ] Panel slides open smoothly
- [ ] Category badge displays correctly
- [ ] Title and description show
- [ ] Code snippet/template loads
- [ ] Syntax highlighting works in code
- [ ] Close button (X) works
- [ ] Clicking same item closes panel
- [ ] Clicking different item switches content
- [ ] Active item has ring highlight
- [ ] Panel closes when filtering

### Detail Panel - Dark Theme
- [ ] Panel background is dark
- [ ] Text has good contrast
- [ ] Code has syntax colors

### Detail Panel - Light Theme
- [ ] Panel background is light
- [ ] Code blocks stay dark
- [ ] Syntax highlighting visible
- [ ] Metrics/badges have darker colors

---

## 8. Footer

### Content
- [ ] Copyright text displays
- [ ] Year is correct

---

## 9. Responsive Design

### Desktop (>1024px)
- [ ] Full navigation visible
- [ ] 8-column performance grid
- [ ] Proper spacing and layout

### Tablet (768px - 1024px)
- [ ] Layout adapts correctly
- [ ] Navigation still usable

### Mobile (<768px)
- [ ] Hamburger menu appears
- [ ] 4-column performance grid
- [ ] Cards stack vertically
- [ ] ASCII diagrams scroll horizontally
- [ ] Touch targets are large enough

---

## 10. Performance

### Loading
- [ ] Page loads in under 3 seconds
- [ ] No layout shift during load
- [ ] Images load progressively

### Interactions
- [ ] Animations are smooth (60fps)
- [ ] No jank when scrolling
- [ ] Filter transitions are smooth
- [ ] Detail panel animation is smooth

---

## 11. Accessibility

### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Enter/Space activates buttons

### Screen Reader
- [ ] Page has proper heading hierarchy
- [ ] Images have alt text
- [ ] Buttons have accessible names
- [ ] ARIA labels where needed

---

## 12. Browser Compatibility

### Chrome
- [ ] All features work correctly

### Firefox
- [ ] All features work correctly

### Safari
- [ ] All features work correctly
- [ ] Backdrop blur works

### Edge
- [ ] All features work correctly

---

## Test Sign-off

| Tester | Date | Browser | Device | Pass/Fail |
|--------|------|---------|--------|-----------|
|        |      |         |        |           |

### Notes
<!-- Add any issues found during testing -->
