class ThemeManager {
  constructor() {
    this.isDarkMode = false;
    this.observers = new Set();
    this.init();
  }

  init() {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setTheme('dark', false); // Don't save to localStorage again
    } else {
      this.setTheme('light', false);
    }
  }

  setTheme(theme, save = true) {
    this.isDarkMode = theme === 'dark';
    
    // Apply theme to body
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    
    // Save to localStorage
    if (save) {
      localStorage.setItem('theme', theme);
    }
    
    // Notify observers
    this.notifyObservers(theme);
    
    // Dispatch global event for backward compatibility
    document.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme } 
    }));
  }

  toggleTheme() {
    const newTheme = this.isDarkMode ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme() {
    return this.isDarkMode ? 'dark' : 'light';
  }

  subscribe(callback) {
    this.observers.add(callback);
    // Immediately call with current theme
    callback(this.getCurrentTheme());
    
    // Return unsubscribe function
    return () => {
      this.observers.delete(callback);
    };
  }

  notifyObservers(theme) {
    this.observers.forEach(callback => {
      try {
        callback(theme);
      } catch (error) {
        console.error('Error in theme observer:', error);
      }
    });
  }
}

// Create singleton instance
const themeManager = new ThemeManager();

export default themeManager;