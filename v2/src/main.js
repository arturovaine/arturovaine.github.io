// Import components
import './components/PortfolioApp.js';
import './components/ThemeToggle.js';
import './components/HeroSection.js';
// import './components/StatsSection.js';
import './components/ActionButtons.js';
import './components/TabsSection.js';
import './components/PortfolioSection.js';
import './components/ProfileSection.js';
import './components/FooterSection.js';
import './components/ScrollToTop.js';
import './components/ModelViewer.js';

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: 'dark' } }));
  }
});