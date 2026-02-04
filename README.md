# Portfolio Website

A modern, component-based portfolio website showcasing professional experience, projects, and technical skills.

## Live Site

Visit: [arturovaine.github.io](https://arturovaine.github.io)

## Features

- **Component Architecture** - Modular HTML components loaded dynamically
- **Data-Driven Rendering** - JSON data files with JavaScript renderers
- **Responsive Design** - Optimized for all devices (desktop, tablet, mobile)
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **3D Model Viewer** - Interactive Three.js integration for STL model visualization
- **Project Modal** - Detailed project information with features and tech stack
- **Video Carousel** - Award highlights with smooth navigation
- **Image Slider** - Pixel art collection with lazy loading
- **Button & Card Systems** - Reusable CSS component classes
- **Performance Optimized** - Lazy loading, skeleton placeholders, optimized assets
- **Modern Stack** - Vanilla JavaScript (ES6 Modules), Tailwind CSS, Lucide icons

## Technologies

- HTML5
- CSS3 with Tailwind CSS
- Vanilla JavaScript (ES6 Modules)
- Three.js for 3D rendering
- Lucide icons
- Google Cloud Storage for video hosting

## Architecture

The site uses a component-based architecture where HTML components are loaded dynamically and data is rendered from JSON files:

```javascript
// Component loader manages sections in groups
headerComponents: ['backdrop', 'header']
mainComponents: ['hero', 'hero-cards', 'work', 'experience', 'awards', 'award-highlights', 'posts', 'volunteering', 'bootstrapping', 'artworks']
footerComponents: ['footer']

// Data-driven renderers
ProjectRenderer       -> data/projects.json
AwardRenderer         -> data/awards.json
ExperienceRenderer    -> data/experience.json
HeroCardRenderer      -> data/hero-cards.json
PostRenderer          -> data/posts.json
ArtworkRenderer       -> data/artworks.json
VolunteeringRenderer  -> data/volunteering.json
BootstrappingRenderer -> data/bootstrapping.json
```

## Project Structure

```
arturovaine.github.io/
├── components/              # HTML component files
│   ├── header.html
│   ├── footer.html
│   ├── backdrop.html
│   ├── hero.html
│   ├── hero-cards.html
│   ├── work.html
│   ├── experience.html
│   ├── awards.html
│   ├── award-highlights.html
│   └── ...
├── data/                    # JSON data files
│   ├── projects.json
│   ├── awards.json
│   ├── experience.json
│   ├── hero-cards.json
│   ├── posts.json
│   ├── artworks.json
│   ├── volunteering.json
│   └── bootstrapping.json
├── js/                      # JavaScript modules
│   ├── componentLoader.js
│   ├── main.js
│   ├── components/
│   │   ├── ThemeManager.js
│   │   ├── ProjectModal.js
│   │   ├── ModelViewer.js
│   │   ├── ImageSlider.js
│   │   ├── VideoCarousel.js
│   │   └── ...
│   └── renderers/
│       ├── ProjectRenderer.js
│       ├── AwardRenderer.js
│       ├── ExperienceRenderer.js
│       ├── HeroCardRenderer.js
│       ├── PostRenderer.js
│       ├── ArtworkRenderer.js
│       ├── VolunteeringRenderer.js
│       └── BootstrappingRenderer.js
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── thumbs/
│   │   └── 3d/
│   └── data/
│       └── pixelart-frames.json
├── css/                     # Modular CSS files
│   ├── theme.css            # Main entry (imports all)
│   ├── base.css             # Variables, layout, responsive
│   ├── buttons.css          # Button components
│   ├── cards.css            # Card components
│   ├── modal.css            # Modal & cookie banner
│   └── light-theme.css      # Light theme overrides
├── index.html
└── README.md
```

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/arturovaine/arturovaine.github.io.git
cd arturovaine.github.io
```

2. Serve using a local HTTP server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

### Important Note

Components must be served via HTTP(S) - opening `index.html` directly in a browser will not work due to CORS restrictions when loading component files.

## Version Management

This project uses git tags for version management:

- `v1.0.0` - Data-driven architecture with JSON renderers, modal system, and CSS components (Feb 2026) - Current
- `v6` - Component-based architecture (Nov 2025)
- `v5` - Redesign with Tailwind CSS (Nov 2025)
- `v2` - Web Components refactor (May 2025)
- `v1` - Initial version (March 2022)

### Viewing Previous Versions

```bash
# List all versions
git tag -l

# Checkout a specific version
git checkout v5.0

# Return to current version
git checkout main

# View archive branch
git checkout archive/v5
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              index.html                                     │
│                                  │                                          │
│                           ┌──────┴──────┐                                   │
│                           │   main.js   │                                   │
│                           └──────┬──────┘                                   │
│                                  │                                          │
│              ┌───────────────────┼───────────────────┐                      │
│              │                   │                   │                      │
│              ▼                   ▼                   ▼                      │
│    ┌─────────────────┐  ┌───────────────┐  ┌─────────────────┐              │
│    │ ComponentLoader │  │ ThemeManager  │  │    Renderers    │              │
│    └────────┬────────┘  └───────────────┘  └────────┬────────┘              │
│             │                                       │                       │
│             ▼                                       ▼                       │
│    ┌─────────────────┐                    ┌─────────────────┐               │
│    │   components/   │                    │      data/      │               │
│    │    *.html       │                    │     *.json      │               │
│    └─────────────────┘                    └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Flow (Renderers)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      fetch()      ┌──────────────┐      innerHTML        │
│   │  *Renderer   │ ───────────────►  │  data/*.json │ ───────────────►  DOM │
│   └──────────────┘                   └──────────────┘                       │
│                                                                             │
│   Renderers:                         JSON Data:                             │
│   ├── ProjectRenderer.js      ◄────► projects.json                          │
│   ├── AwardRenderer.js        ◄────► awards.json                            │
│   ├── ExperienceRenderer.js   ◄────► experience.json                        │
│   ├── HeroCardRenderer.js     ◄────► hero-cards.json                        │
│   ├── PostRenderer.js         ◄────► posts.json                             │
│   ├── ArtworkRenderer.js      ◄────► artworks.json                          │
│   ├── VolunteeringRenderer.js ◄────► volunteering.json                      │
│   └── BootstrappingRenderer.js◄────► bootstrapping.json                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         Component Loading Strategy                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. Header (immediate)     2. Critical (immediate)    3. Lazy (on scroll)  │
│   ┌─────────────────┐       ┌─────────────────┐        ┌─────────────────┐  │
│   │ backdrop        │       │ hero            │        │ work            │  │
│   │ header          │       │ hero-cards      │        │ experience      │  │
│   └─────────────────┘       └─────────────────┘        │ awards          │  │
│                                                        │ award-highlights│  │
│   4. Footer (after main)                               │ posts           │  │
│   ┌─────────────────┐                                  │ volunteering    │  │
│   │ footer          │                                  │ bootstrapping   │  │
│   │ cookie-banner   │                                  │ artworks        │  │
│   └─────────────────┘                                  └─────────────────┘  │
│                                                                             │
│   IntersectionObserver (rootMargin: 300px) triggers lazy component loading  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CSS Architecture                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   theme.css (entry point)                                                   │
│       │                                                                     │
│       ├── @import base.css        → Variables, layout, responsive           │
│       ├── @import buttons.css     → .btn-*, .tag, .badge-status             │
│       ├── @import cards.css       → .card, .card-image, .card-overlay       │
│       ├── @import modal.css       → .modal, .cookie-banner-*                │
│       └── @import light-theme.css → body.light-theme overrides              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Components

### Component Loader
Dynamically loads HTML components with lazy loading via IntersectionObserver. Components are grouped by priority: header (immediate), critical (immediate), lazy (on scroll), footer (after main).

### Data Renderers
JavaScript modules that fetch JSON data and render HTML dynamically using `.map()`. Each renderer uses IntersectionObserver with 200px rootMargin for lazy initialization.

### Project Modal
Displays detailed project information including features, tech stack, and status badges with keyboard support.

### Theme Manager
Handles dark/light theme switching with localStorage persistence and smooth transitions.

### Model Viewer
Three.js-powered STL file viewer with orbit controls and responsive rendering.

### Image Slider
Pixel art collection slider with lazy loading and skeleton placeholder.

### Video Carousel
Award highlights carousel with navigation controls and video playback.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for images and components
- Videos hosted on Google Cloud Storage
- Optimized WebP images with fallbacks
- Minimal JavaScript bundle size

## Deployment

The site is automatically deployed to GitHub Pages from the `main` branch. Any push to main triggers a new deployment.

## License

This project is open source and available under the MIT License.

## Contact

- LinkedIn: [linkedin.com/in/arturovaine](https://linkedin.com/in/arturovaine)
- GitHub: [@arturovaine](https://github.com/arturovaine)
- Email: arturo.vaine@gmail.com
- Website: [arturovaine.github.io](https://arturovaine.github.io)
