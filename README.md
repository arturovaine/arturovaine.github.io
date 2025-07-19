# Portfolio Website

A modern, responsive portfolio website built with vanilla JavaScript and Web Components.

## Features

- **Dark/Light Theme Toggle** - Switch between light and dark modes with smooth transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI** - Clean, minimalist design with smooth animations
- **Web Components** - Built using custom HTML elements for modularity

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript
- Web Components
- Google Fonts (Poppins)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/arturovaine/arturovaine.github.io.git
```

2. Open `index.html` in your browser or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

3. Navigate to `http://localhost:8000` in your browser

## Project Structure

```
├── index.html
├── main.js
├── counter.js
├── javascript.svg
├── threeSetup.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── _v1/
├── _v2/
├── dist/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ActionButtons.js
│   │   ├── FooterSection.js
│   │   ├── HeroSection.js
│   │   ├── ModelViewer.js
│   │   ├── PortfolioApp.js
│   │   ├── PortfolioSection.js
│   │   ├── ProfileSection.js
│   │   ├── ScrollToTop.js
│   │   ├── SkillsSection.js
│   │   ├── StatsSection.js
│   │   ├── TabsSection.js
│   │   └── ThemeToggle.js
│   └── data/
│       ├── portfolio.json
│       └── profile.json
├── js/
├── styles/
│   └── global.css
└── style.css
```

## Theme Toggle

The theme toggle is implemented as a custom Web Component (`<theme-toggle>`) that:
- Persists theme preference in localStorage
- Dispatches custom events for theme changes
- Includes smooth transitions between themes
- Features hover animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- GitHub: [@arturovaine](https://github.com/arturovaine)
- Website: [arturovaine.github.io](https://arturovaine.github.io)