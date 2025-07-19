class ImageSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 0;
    this.images = [
      'src/assets/images/pxart/pxArt.png',
      'src/assets/images/pxart/pxArt (1).png',
      'src/assets/images/pxart/pxArt (2).png',
      'src/assets/images/pxart/pxArt (3).png',
      'src/assets/images/pxart/pxArt (4).png',
      'src/assets/images/pxart/pxArt (5).png',
      'src/assets/images/pxart/pxArt (6).png',
      'src/assets/images/pxart/pxArt (7).png',
      'src/assets/images/pxart/pxArt (8).png',
      'src/assets/images/pxart/pxArt (9).png',
      'src/assets/images/pxart/pxArt (10).png',
      'src/assets/images/pxart/pxArt (11).png',
      'src/assets/images/pxart/pxArt (12).png',
      'src/assets/images/pxart/pxArt (13).png',
      'src/assets/images/pxart/pxArt (14).png',
      'src/assets/images/pxart/pxArt (15).png',
      'src/assets/images/pxart/pxArt (16).png',
      'src/assets/images/pxart/pxArt (17).png',
      'src/assets/images/pxart/pxArt (18).png',
      'src/assets/images/pxart/pxArt (19).png',
      'src/assets/images/pxart/pxArt (20).png',
      'src/assets/images/pxart/pxArt (21).png',
      'src/assets/images/pxart/pxArt (22).png',
      'src/assets/images/pxart/pxArt (23).png',
      'src/assets/images/pxart/pxArt (24).png',
      'src/assets/images/pxart/pxArt (25).png',
      'src/assets/images/pxart/pxArt (26).png',
      'src/assets/images/pxart/pxArt (27).png',
      'src/assets/images/pxart/pxArt (28).png',
      'src/assets/images/pxart/pxArt (29).png',
      'src/assets/images/pxart/pxArt (30).png',
      'src/assets/images/pxart/pxArt (31).png',
      'src/assets/images/pxart/pxArt (32).png',
      'src/assets/images/pxart/pxArt (33).png',
      'src/assets/images/pxart/pxArt (34).png',
      'src/assets/images/pxart/pxArt (35).png',
      'src/assets/images/pxart/pxArt (36).png',
      'src/assets/images/pxart/pxArt (37).png',
      'src/assets/images/pxart/pxArt (38).png',
      'src/assets/images/pxart/pxArt (39).png',
      'src/assets/images/pxart/pxArt (40).png',
      'src/assets/images/pxart/pxArt (41).png',
      'src/assets/images/pxart/pxArt (42).png',
      'src/assets/images/pxart/pxArt (43).png',
      'src/assets/images/pxart/pxArt (44).png',
      'src/assets/images/pxart/pxArt (45).png',
      'src/assets/images/pxart/pxArt (46).png',
      'src/assets/images/pxart/pxArt (47).png',
      'src/assets/images/pxart/pxArt (48).png',
      'src/assets/images/pxart/pxArt (49).png',
      'src/assets/images/pxart/pxArt (50).png',
      'src/assets/images/pxart/pxArt (51).png',
      'src/assets/images/pxart/pxArt (52).png',
      'src/assets/images/pxart/pxArt (53).png',
      'src/assets/images/pxart/pxArt (54).png',
      'src/assets/images/pxart/pxArt (55).png',
      'src/assets/images/pxart/pxArt (56).png',
      'src/assets/images/pxart/pxArt (57).png',
      'src/assets/images/pxart/pxArt (58).png',
      'src/assets/images/pxart/pxArt (59).png',
      'src/assets/images/pxart/pxArt (60).png',
      'src/assets/images/pxart/pxArt (61).png',
      'src/assets/images/pxart/pxArt (62).png',
      'src/assets/images/pxart/pxArt (63).png',
      'src/assets/images/pxart/pxArt (64).png',
      'src/assets/images/pxart/pxArt (65).png',
      'src/assets/images/pxart/pxArt (66).png',
      'src/assets/images/pxart/pxArt (67).png',
      'src/assets/images/pxart/pxArt (68).png',
      'src/assets/images/pxart/pxArt (69).png',
      'src/assets/images/pxart/pxArt (70).png',
      'src/assets/images/pxart/pxArt (71).png',
      'src/assets/images/pxart/pxArt (72).png',
      'src/assets/images/pxart/pxArt (73).png',
      'src/assets/images/pxart/pxArt (74).png'
    ];
    this.animationInterval = null;
  }

  connectedCallback() {
    this.render();
    this.startAnimation();
  }

  disconnectedCallback() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  startAnimation() {
    this.animationInterval = setInterval(() => {
      this.nextSlide();
    }, 133);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateSlider();
  }

  updateSlider() {
    const leftImage = this.shadowRoot.querySelector('.slider__image--left');
    const centerImage = this.shadowRoot.querySelector('.slider__image--center');
    const rightImage = this.shadowRoot.querySelector('.slider__image--right');

    const prevIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    const nextIndex = (this.currentIndex + 1) % this.images.length;

    leftImage.src = this.images[prevIndex];
    centerImage.src = this.images[this.currentIndex];
    rightImage.src = this.images[nextIndex];
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .image-slider {
          width: 760px;
          margin: 0 auto 20px;
          background-color: transparent;
          border: none;
          overflow: visible;
          position: relative;
        }
        .slider__container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
          padding: 20px;
          perspective: 1200px;
          perspective-origin: center center;
        }
        .slider__image {
          border-radius: 0;
          border: 1px solid #c0c0c0;
          transition: transform 0.5s ease, opacity 0.5s ease, border-color 0.3s ease;
          object-fit: cover;
          position: relative;
        }
        .slider__image--left {
          width: 240px;
          height: 320px;
          opacity: 0.7;
          transform: rotateY(-45deg) translateZ(-80px) scale(0.8);
          transform-origin: left center;
          margin-right: -40px;
        }
        .slider__image--right {
          width: 240px;
          height: 320px;
          opacity: 0.7;
          transform: rotateY(45deg) translateZ(-80px) scale(0.8);
          transform-origin: right center;
          margin-left: -40px;
        }
        .slider__image--center {
          width: 320px;
          height: 320px;
          opacity: 1;
          transform: translateZ(0px);
          border-color: #b8a02b;
          box-shadow: 0 4px 12px rgba(184, 160, 43, 0.3);
          z-index: 2;
        }
        .slider__description {
          display: none;
        }
        :host-context(body.dark-mode) .slider__description {
          color: var(--dark-text-primary, #f1f2f4);
        }
        :host-context(body.dark-mode) .slider__image {
          border-color: #c0c0c0;
        }
        :host-context(body.dark-mode) .slider__image--center {
          border-color: #b8a02b;
        }
        
        @media (max-width: 1024px) {
          .image-slider {
            width: 720px;
            margin: 0 auto 52px;
          }
          .slider__container {
            height: 320px;
            padding: 15px;
            perspective: 1000px;
          }
          .slider__image--left {
            width: 200px;
            height: 280px;
            transform: rotateY(-45deg) translateZ(-60px) scale(0.8);
            margin-right: -30px;
          }
          .slider__image--right {
            width: 200px;
            height: 280px;
            transform: rotateY(45deg) translateZ(-60px) scale(0.8);
            margin-left: -30px;
          }
          .slider__image--center {
            width: 280px;
            height: 280px;
          }
          .slider__description {
            font-size: 13px;
            padding: 16px;
          }
        }
        
        @media (max-width: 600px) {
          .image-slider {
            width: 380px;
            margin: 0 auto 30px;
          }
          .slider__container {
            height: 240px;
            padding: 10px;
            perspective: 800px;
          }
          .slider__image--left {
            width: 120px;
            height: 180px;
            transform: rotateY(-45deg) translateZ(-40px) scale(0.8);
            margin-right: -20px;
          }
          .slider__image--right {
            width: 120px;
            height: 180px;
            transform: rotateY(45deg) translateZ(-40px) scale(0.8);
            margin-left: -20px;
          }
          .slider__image--center {
            width: 180px;
            height: 180px;
          }
          .slider__description {
            font-size: 12px;
            padding: 12px;
          }
        }
      </style>
      <div class="image-slider">
        <div class="slider__container">
          <img class="slider__image slider__image--left" alt="Previous artwork">
          <img class="slider__image slider__image--center" alt="Current artwork">
          <img class="slider__image slider__image--right" alt="Next artwork">
        </div>
        <div class="slider__description">
          Mechanical Engineer, Software Developer
        </div>
      </div>
    `;
    
    this.updateSlider();
  }
}

customElements.define('image-slider', ImageSlider);

export default ImageSlider;