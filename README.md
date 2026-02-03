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
ProjectRenderer   -> data/projects.json
AwardRenderer     -> data/awards.json
ExperienceRenderer -> data/experience.json
HeroCardRenderer  -> data/hero-cards.json
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
│   └── hero-cards.json
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
│       └── HeroCardRenderer.js
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── thumbs/
│   │   └── 3d/
│   └── data/
│       └── pixelart-frames.json
├── css/
│   └── theme.css            # Button, card, modal component systems
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

- `v1.0.0` - Component-based architecture with performance optimizations (Feb 2026)
- `v6.0` - Component-based architecture (Nov 2025)
- `v5.0` - Pre-component architecture redesign (Nov 2025)
- `v2.0` - Web Components refactor (May 2025)
- `v1.0` - Initial version (March 2022)

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

## Key Components

### Component Loader
Dynamically loads HTML components in three groups (header, main, footer) and initializes Lucide icons.

### Data Renderers
JavaScript modules that fetch JSON data and render HTML dynamically using `.map()` for projects, awards, experience, and hero cards.

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
