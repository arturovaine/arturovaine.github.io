class ModelViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isUserInteracting = false;
    this.autoRotationEnabled = true;
    this.threeJSLoaded = false;
    this.isComponentVisible = false;
  }

  connectedCallback() {
    this.render();
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.threeJSLoaded) {
            this.isComponentVisible = true;
            this.loadThreeJSAndSetup();
            observer.unobserve(this);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(this);
  }

  async loadThreeJSAndSetup() {
    if (this.threeJSLoaded) return;
    
    try {
      const loadingElement = this.shadowRoot.querySelector('.loading-indicator');
      if (loadingElement) loadingElement.style.display = 'block';

      const [
        THREE,
        { STLLoader },
        { OrbitControls }
      ] = await Promise.all([
        import('three'),
        import('three/examples/jsm/loaders/STLLoader.js'),
        import('three/examples/jsm/controls/OrbitControls.js')
      ]);

      this.THREE = THREE;
      this.STLLoader = STLLoader;
      this.OrbitControls = OrbitControls;
      this.threeJSLoaded = true;

      this.setupThreeJS();
      
      if (loadingElement) loadingElement.style.display = 'none';
    } catch (error) {
      console.error('Failed to load Three.js:', error);
      this.showFallback();
    }
  }

  showFallback() {
    const container = this.shadowRoot.querySelector('.model-viewer__canvas');
    container.innerHTML = '<div class="fallback-message">3D model could not be loaded</div>';
  }

  setupThreeJS() {
    const container = this.shadowRoot.querySelector('.model-viewer__canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const { THREE } = this;
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    // Add OrbitControls
    this.controls = new this.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.autoRotate = false; // We'll handle rotation manually
    this.controls.autoRotateSpeed = 2.0;

    // Add event listeners for user interaction
    this.controls.addEventListener('start', () => {
      this.isUserInteracting = true;
      this.autoRotationEnabled = false;
    });

    this.controls.addEventListener('end', () => {
      this.isUserInteracting = false;
      // Resume auto-rotation after user stops interacting
      setTimeout(() => {
        if (!this.isUserInteracting) {
          this.autoRotationEnabled = true;
        }
      }, 2000); // Resume after 2 seconds of no interaction
    });

    // Load model
    const loader = new this.STLLoader();
    const modelUrl = 'src/assets/3d/3d-model.stl';

    loader.load(modelUrl, (geometry) => {
      const material = new this.THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x111111,
        shininess: 200,
        opacity: 0.8,
        transparent: true,
        wireframe: true
      });

      this.mesh = new this.THREE.Mesh(geometry, material);
      geometry.center();
      this.mesh.scale.set(0.1, 0.1, 0.1);
      this.mesh.position.x += 0.5;
      this.scene.add(this.mesh);

      // Adjust camera position
      const box = new this.THREE.Box3().setFromObject(this.mesh);
      const center = box.getCenter(new this.THREE.Vector3());
      const size = box.getSize(new this.THREE.Vector3());

      this.camera.position.set(
        center.x + size.x * -1.25 * 0.75 - 1,
        center.y - size.y * -5 * 0.75,
        center.z + size.z * -1 * 0.75
      );
      this.camera.lookAt(center);

      this.animate();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(newWidth, newHeight);
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // Update controls for smooth interaction
    if (this.controls) {
      this.controls.update();
    }

    // Apply original rotation axis when auto-rotation is enabled
    if (this.mesh && this.autoRotationEnabled && !this.isUserInteracting) {
      const rotationAxis = new this.THREE.Vector3(0.1, 0, 1).normalize();
      this.mesh.rotateOnAxis(rotationAxis, 0.01);
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .model-viewer {
          width: 760px;
          margin: 0 auto 65px;
          background-color: var(--light-card-bg, #ffffff);
          border-radius: 0;
          border: 1px solid #c0c0c0;
          overflow: hidden;
          position: relative;
          transition: background-color var(--transition-time, 0.7s) ease, border-color 0.3s ease;
        }
        .model-viewer__canvas {
          width: 100%;
          height: 400px;
          position: relative;
        }
        .loading-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          color: var(--light-text-primary, #3d3d3d);
          display: none;
        }
        .fallback-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          color: var(--light-text-primary, #3d3d3d);
          text-align: center;
        }
        :host-context(body.dark-mode) .loading-indicator,
        :host-context(body.dark-mode) .fallback-message {
          color: var(--dark-text-primary, #f1f2f4);
        }
        .model-viewer__canvas::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 120px;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 100%);
          pointer-events: none;
        }
        .model-viewer__description {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          padding: 0;
          font-size: 14px;
          line-height: 1.6;
          color: var(--light-text-primary, #3d3d3d);
          z-index: 10;
          pointer-events: none;
        }
        .model-viewer__link {
          color: var(--accent-light, #f7d039);
          text-decoration: none;
          transition: color var(--transition-time, 0.7s) ease;
          pointer-events: auto;
        }
        .model-viewer__link:hover {
          text-decoration: underline;
        }
        
        :host-context(body.dark-mode) .model-viewer {
          background-color: var(--dark-card-bg, #171f26);
        }
        :host-context(body.dark-mode) .model-viewer__description {
          color: var(--dark-text-primary, #f1f2f4);
        }
        :host-context(body.dark-mode) .model-viewer__canvas::after {
          background: linear-gradient(to top, rgba(23, 31, 38, 0.95) 0%, rgba(23, 31, 38, 0) 100%);
        }
        :host-context(body.dark-mode) .model-viewer__link {
          color: var(--accent-dark, #ffe071);
        }
        
        @media (max-width: 1024px) {
          .model-viewer {
            width: 549px;
            margin: 0 auto 52px;
          }
          .model-viewer__canvas {
            height: 300px;
          }
          .model-viewer__description {
            font-size: 13px;
            padding: 16px;
          }
        }
        
        @media (max-width: 600px) {
          .model-viewer {
            width: 330px;
            margin: 0 auto 30px;
          }
          .model-viewer__canvas {
            height: 250px;
          }
          .model-viewer__description {
            font-size: 12px;
            padding: 12px;
          }
        }
      </style>
      <div class="model-viewer">
        <div class="model-viewer__canvas">
          <div class="loading-indicator">Loading 3D model...</div>
        </div>
        <div class="model-viewer__description">
          Concept design of a bionic hand created in SolidWorks and rendered using Three.js. 
          <a href="https://www.behance.net/gallery/70813139/Bionic-Hand-(2018)" target="_blank" class="model-viewer__link">View on Behance</a>
        </div>
      </div>
    `;
  }
}

customElements.define('model-viewer', ModelViewer);

export default ModelViewer;