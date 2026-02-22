export const LogoCarousel = {
  logos: [
    { src: 'src/assets/images/logos/supercampo.png', alt: 'Supercampo', url: 'https://vtex.com/pt-br/casos-de-clientes/supercampo-digitaliza-operacao-de-11-das-20-maiores-cooperativas-da-agroindustria-brasileira/' },
    { src: 'src/assets/images/logos/simepar-dark.png', srcLight: 'src/assets/images/logos/simepar.png', alt: 'SIMEPAR', scale: 2, url: 'https://www.simepar.br/simepar' },
    { src: 'src/assets/images/logos/techteems-dark.png', srcLight: 'src/assets/images/logos/techteems-light.png', alt: 'TechTeems', scale: 0.5, url: 'https://techteems.com/' },
    { src: 'src/assets/images/logos/nilgai-logo.svg', alt: 'Nilgai', url: 'https://nilg.ai/' },
    { src: 'src/assets/images/logos/brg.png', alt: 'BRG', url: 'https://brggeradores.com.br/' },
    { src: 'src/assets/images/logos/meros.png', alt: 'Meros', url: 'https://merosdobrasil.org/' },
    { src: 'src/assets/images/logos/accef.png', alt: 'ACCEF', url: 'https://instituicaoaccef.com.br/' },
    { src: 'src/assets/images/logos/icoop-logo.png', alt: 'iCoop', url: 'https://icoop.com.br/' }
  ],

  init() {
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
  }
};
