class SkillsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.visible = false;
    this.skills = [
      { name: 'JavaScript', icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_js.svg' },
      { name: 'HTML', icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_html.svg' },
      { name: 'CSS', icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_css.svg' },
      { name: 'React', icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_reactjs.svg' },
      { name: 'Python', icon: 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_python.svg' }
    ];
  }

  connectedCallback() {
    this.render();
    
    // Listen for tab changes
    document.addEventListener('tab-changed', (e) => {
      this.visible = e.detail.tab === 'skills';
      this.shadowRoot.querySelector('.skills').style.display = this.visible ? 'block' : 'none';
      
      if (this.visible) {
        this.animateSkills();
      }
    });
  }
  
  animateSkills() {
    const skillItems = this.shadowRoot.querySelectorAll('.skills__item');
    skillItems.forEach((item, index) => {
      item.style.animation = 'none';
      setTimeout(() => {
        item.style.animation = `bounceIn 0.6s ease-out ${index * 0.1}s forwards`;
      }, 10);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .skills {
          display: ${this.visible ? 'block' : 'none'};
          max-width: 757px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .skills__wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
        }
        .skills__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          opacity: 0;
        }
        .skills__img {
          width: 80px;
          height: 80px;
          margin-bottom: 10px;
          transition: transform 0.3s ease;
        }
        .skills__item:hover .skills__img {
          transform: scale(1.1);
        }
        .skills__name {
          font-size: 16px;
          font-weight: 500;
          color: var(--light-text-primary, #3d3d3d);
          transition: color var(--transition-time, 0.7s) ease;
        }
        :host-context(body.dark-mode) .skills__name {
          color: var(--dark-text-secondary, #a3abb2);
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @media (max-width: 1024px) {
          .skills__img {
            width: 60px;
            height: 60px;
          }
          .skills__name {
            font-size: 14px;
          }
        }
        
        @media (max-width: 600px) {
          .skills__wrapper {
            gap: 25px;
          }
          .skills__img {
            width: 50px;
            height: 50px;
          }
          .skills__name {
            font-size: 12px;
          }
        }
      </style>
      
      <section class="skills">
        <div class="skills__wrapper">
          ${this.skills.map(skill => `
            <div class="skills__item">
              <img src="${skill.icon}" alt="${skill.name}" class="skills__img">
              <div class="skills__name">${skill.name}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('skills-section', SkillsSection);

export default SkillsSection;