// Accessibility menu — a lower-left wheelchair button that opens a panel of
// toggles (larger text, high contrast, readable font, spacing, focus rings,
// link highlighting, bigger tap targets, reduced motion, reading guide and
// image descriptions). State is persisted in localStorage and applied as
// classes on <html> so rem-based text scaling works site-wide.
export const AccessibilityMenu = {
  STORAGE_KEY: 'portfolio-a11y',

  FEATURES: [
    { key: 'large-text',      label: 'Larger Text',        desc: 'Increases base font size for easier reading' },
    { key: 'high-contrast',   label: 'High Contrast',      desc: 'Strengthens color contrast for better visibility' },
    { key: 'readable-font',   label: 'Readable Font',      desc: 'Switches to a highly legible sans-serif typeface' },
    { key: 'line-spacing',    label: 'Wider Line Spacing', desc: 'Adds extra space between lines of text' },
    { key: 'word-spacing',    label: 'Word Spacing',       desc: 'Adds extra space between words for clarity' },
    { key: 'focus',           label: 'Focus Indicators',   desc: 'Shows outlines around all interactive elements' },
    { key: 'highlight-links', label: 'Highlight Links',    desc: 'Underlines and colors all links for visibility' },
    { key: 'tap-targets',     label: 'Bigger Tap Targets', desc: 'Increases clickable area of buttons and links' },
    { key: 'reduce-motion',   label: 'Reduce Motion',      desc: 'Minimizes animations throughout the site' },
    { key: 'reading-guide',   label: 'Reading Guide',      desc: 'Shows a horizontal line that follows your cursor' },
    { key: 'image-desc',      label: 'Image Descriptions', desc: 'Shows descriptive labels on all images' }
  ],

  // Universal access symbol (uxwing) — solid glyph rendered white via CSS filter
  ICON: `<img src="/src/assets/images/icons/accessibility-icon.png" alt="" aria-hidden="true"
             width="26" height="26" class="a11y-icon-img" decoding="async">`,

  state: {},
  isOpen: false,

  init() {
    if (document.getElementById('a11y-toggle')) return; // already mounted
    this.state = this.load();
    this.render();
    this.cache();
    this.bind();
    // Apply saved preferences on load
    this.FEATURES.forEach(f => { if (this.state[f.key]) this.apply(f.key, true, false); });
    this.syncSwitches();
  },

  load() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {}; }
    catch { return {}; }
  },

  save() {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state)); } catch {}
  },

  render() {
    const rows = this.FEATURES.map(f => `
      <li class="a11y-row">
        <div class="a11y-row-text">
          <span class="a11y-row-title">${f.label}</span>
          <span class="a11y-row-desc">${f.desc}</span>
        </div>
        <button type="button" role="switch" aria-checked="false" class="a11y-switch"
                data-key="${f.key}" aria-label="${f.label}">
          <span class="a11y-switch-track"><span class="a11y-switch-thumb"></span></span>
        </button>
      </li>`).join('');

    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <button id="a11y-toggle" type="button" aria-label="Accessibility options"
              aria-haspopup="dialog" aria-expanded="false" aria-controls="a11y-panel"
              title="Accessibility">${this.ICON}</button>

      <div id="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-panel-title" hidden>
        <div class="a11y-panel-head">
          <h2 id="a11y-panel-title">Accessibility</h2>
          <button type="button" id="a11y-close" class="a11y-close" aria-label="Close accessibility menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>
        <ul class="a11y-list">${rows}</ul>
        <p class="a11y-note">This website is designed to be accessible to everyone.</p>
      </div>`;
    document.body.appendChild(wrap);
  },

  cache() {
    this.toggleBtn = document.getElementById('a11y-toggle');
    this.panel = document.getElementById('a11y-panel');
    this.switches = [...this.panel.querySelectorAll('.a11y-switch')];
  },

  bind() {
    this.toggleBtn.addEventListener('click', () => this.togglePanel());
    document.getElementById('a11y-close').addEventListener('click', () => this.closePanel());

    this.switches.forEach(sw => {
      sw.addEventListener('click', () => {
        const key = sw.dataset.key;
        const on = !(this.state[key]);
        this.state[key] = on;
        this.apply(key, on, true);
        sw.setAttribute('aria-checked', String(on));
        this.save();
      });
    });

    // Close on outside click / Escape
    document.addEventListener('click', (e) => {
      if (!this.isOpen) return;
      if (this.panel.contains(e.target) || this.toggleBtn.contains(e.target)) return;
      this.closePanel();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) { this.closePanel(); this.toggleBtn.focus(); }
    });
  },

  togglePanel() { this.isOpen ? this.closePanel() : this.openPanel(); },

  openPanel() {
    this.panel.hidden = false;
    // next frame so the transition runs
    requestAnimationFrame(() => this.panel.classList.add('open'));
    this.toggleBtn.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    const first = this.panel.querySelector('.a11y-switch');
    if (first) first.focus();
  },

  closePanel() {
    this.panel.classList.remove('open');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
    const onEnd = () => { if (!this.isOpen) this.panel.hidden = true; this.panel.removeEventListener('transitionend', onEnd); };
    this.panel.addEventListener('transitionend', onEnd);
  },

  syncSwitches() {
    this.switches.forEach(sw => sw.setAttribute('aria-checked', String(!!this.state[sw.dataset.key])));
  },

  // Apply one feature. `persist` is false during initial load.
  apply(key, on) {
    document.documentElement.classList.toggle('a11y-' + key, on);
    if (key === 'reading-guide') this.toggleReadingGuide(on);
    if (key === 'image-desc') this.toggleImageDescriptions(on);
  },

  // ---- Reading guide: a horizontal bar that tracks the cursor -------------
  toggleReadingGuide(on) {
    if (on) {
      if (!this.guide) {
        this.guide = document.createElement('div');
        this.guide.id = 'a11y-reading-guide';
        this.guide.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.guide);
        this._onMove = (e) => { this.guide.style.top = (e.touches ? e.touches[0].clientY : e.clientY) + 'px'; };
      }
      this.guide.style.display = 'block';
      window.addEventListener('mousemove', this._onMove, { passive: true });
      window.addEventListener('touchmove', this._onMove, { passive: true });
    } else if (this.guide) {
      this.guide.style.display = 'none';
      window.removeEventListener('mousemove', this._onMove);
      window.removeEventListener('touchmove', this._onMove);
    }
  },

  // ---- Image descriptions: surface each image's alt text as a caption -----
  toggleImageDescriptions(on) {
    if (on) {
      document.querySelectorAll('img').forEach(img => {
        if (img.dataset.a11yDesc) return;
        const text = img.getAttribute('alt') || img.getAttribute('aria-label') || img.getAttribute('title');
        if (!text || !text.trim()) return;
        const cap = document.createElement('span');
        cap.className = 'a11y-img-desc';
        cap.setAttribute('data-a11y-generated', '');
        cap.textContent = text.trim();
        img.insertAdjacentElement('afterend', cap);
        img.dataset.a11yDesc = '1';
      });
    } else {
      document.querySelectorAll('[data-a11y-generated]').forEach(el => el.remove());
      document.querySelectorAll('img[data-a11y-desc]').forEach(img => { delete img.dataset.a11yDesc; });
    }
  }
};
