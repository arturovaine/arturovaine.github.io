export const LogoCarousel = {
  logos: [
    { src: 'src/assets/images/logos/supercampo.png', alt: 'Supercampo', url: 'https://vtex.com/pt-br/casos-de-clientes/supercampo-digitaliza-operacao-de-11-das-20-maiores-cooperativas-da-agroindustria-brasileira/' },
    { src: 'src/assets/images/logos/simepar-dark.png', srcLight: 'src/assets/images/logos/simepar.png', alt: 'SIMEPAR', scale: 2, url: 'https://www.simepar.br/simepar' },
    { src: 'src/assets/images/logos/techteems-dark.png', srcLight: 'src/assets/images/logos/techteems-light.png', alt: 'TechTeems', scale: 0.5, url: 'https://techteems.com/' },
    { src: 'src/assets/images/logos/nilgai-logo.svg', alt: 'Nilgai', url: 'https://nilg.ai/' },
    { src: 'src/assets/images/logos/brg.png', alt: 'BRG', url: 'https://brggeradores.com.br/' },
    { src: 'src/assets/images/logos/meros.png', alt: 'Meros', url: 'https://merosdobrasil.org/' },
    { src: 'src/assets/images/logos/accef.png', alt: 'ACCEF', url: 'https://instituicaoaccef.com.br/' },
    { src: 'src/assets/images/logos/icoop-logo.png', alt: 'iCoop', url: 'https://icoop.com.br/' },
    { src: 'src/assets/images/logos/lar-logo.svg', alt: 'LAR', url: 'https://www.lar.ind.br/' },
    { src: 'src/assets/images/logos/copacol-logo.png', alt: 'Copacol', url: 'https://www.copacol.com.br/' },
    { src: 'src/assets/images/logos/inovativa-logo.png', alt: 'Inovativa', url: 'https://www.inovativa.online/' },
    { src: 'src/assets/images/logos/rae-logo-dark.webp', srcLight: 'src/assets/images/logos/rae-logo-light.webp', alt: 'RAE', url: 'https://raeng.org.uk/programmes-and-prizes/programmes/international-programmes/lif/' },
    { src: 'src/assets/images/logos/fundacao-araucaria-logo.png', alt: 'Fundação Araucária', url: 'https://www.fappr.pr.gov.br/' },
    { src: 'src/assets/images/logos/certi-logo.png', alt: 'CERTI', url: 'https://certi.org.br/' }
    // { src: 'src/assets/images/logos/tristel-logo.png', alt: 'Tristel', url: 'https://tristel.com/' },
    // { src: 'src/assets/images/logos/authentic-trails-logo.svg', alt: 'Authentic Trails', url: 'https://www.authentictrails.com/' },
    // { src: 'src/assets/images/logos/cork-supply-logo.png', alt: 'Cork Supply', url: 'https://corksupply.com/us' }
  ],

  translations: null,
  currentLang: 'en',

  async init() {
    // Load translations for title
    this.currentLang = localStorage.getItem('language') || 'en';
    try {
      const response = await fetch('./data/translations.json');
      this.translations = await response.json();
      this.updateTitle();

      // Listen for language changes
      window.addEventListener('languageChanged', (event) => {
        this.currentLang = event.detail.language;
        this.updateTitle();
      });
    } catch (error) {
      console.error('Failed to load logo carousel translations:', error);
    }
    const track = document.getElementById('logoTrack');
    if (!track) return;

    const isLightTheme = () => document.body.classList.contains('light-theme');

    for (let i = 0; i < 3; i++) {
      this.logos.forEach(logo => {
        const img = document.createElement('img');
        img.src = logo.srcLight && isLightTheme() ? logo.srcLight : logo.src;
        img.alt = logo.alt;
        if (logo.srcLight) {
          img.dataset.srcDark = logo.src;
          img.dataset.srcLight = logo.srcLight;
        }
        if (logo.scale) {
          img.style.height = `${36 * logo.scale}px`;
        }
        if (logo.url) {
          const link = document.createElement('a');
          link.href = logo.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.appendChild(img);
          track.appendChild(link);
        } else {
          track.appendChild(img);
        }
      });
    }

    const observer = new MutationObserver(() => {
      const light = isLightTheme();
      track.querySelectorAll('img[data-src-light]').forEach(img => {
        img.src = light ? img.dataset.srcLight : img.dataset.srcDark;
      });
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const slider = document.getElementById('logoCarousel');
    let isPaused = false;
    slider.addEventListener('mouseenter', () => isPaused = true);
    slider.addEventListener('mouseleave', () => isPaused = false);

    const images = Array.from(track.querySelectorAll('img'));
    const firstSetImages = images.slice(0, this.logos.length);

    Promise.all(firstSetImages.map(img => {
      return new Promise(resolve => {
        if (img.complete && img.naturalWidth > 0) resolve();
        else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    })).then(() => {
      setTimeout(() => {
        const firstImg = images[0];
        const firstImgSet2 = images[this.logos.length];
        const oneSetWidth = firstImgSet2.offsetLeft - firstImg.offsetLeft;

        let x = 0;
        const speed = 0.8;

        const animate = () => {
          if (!isPaused) {
            x = (x + speed) % oneSetWidth;
            track.style.transform = `translateX(${-x}px)`;
          }
          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      }, 200);
    });
  },

  updateTitle() {
    if (!this.translations) return;

    const titleElement = document.querySelector('.logo-title');
    if (titleElement) {
      titleElement.textContent = this.translations[this.currentLang].logoCarousel.title;
    }
  }
};
