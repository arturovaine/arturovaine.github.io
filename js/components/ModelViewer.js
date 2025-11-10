// 3D Model Viewer Component
export const ModelViewer = {
  container: null,
  loadingIndicator: null,
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  mesh: null,
  material: null,
  isUserInteracting: false,
  autoRotationEnabled: true,

  async init() {
    this.container = document.getElementById('model-viewer-container');
    this.loadingIndicator = document.getElementById('loading-indicator');

    if (!this.container) return;

    try {
      await this.loadThreeJS();
      await this.setupScene();
      await this.loadModel();
      this.setupResize();
      this.updateTheme(); // Set initial theme
    } catch (error) {
      console.error('Failed to load Three.js:', error);
      if (this.loadingIndicator) {
        this.loadingIndicator.innerHTML = '<div class="text-xs text-neutral-500">3D viewer unavailable</div>';
      }
    }
  },

  updateTheme() {
    if (!this.scene || !this.THREE) return;

    const isLightTheme = document.body.classList.contains('light-theme');

    // Update scene background
    this.scene.background = new this.THREE.Color(isLightTheme ? 0xf5f5f5 : 0x0a0a0a);

    // Keep material color the same in both themes (grey wireframe)
    // No need to change material color
  },

  async loadThreeJS() {
    const [THREE, { STLLoader }, { OrbitControls }] = await Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/STLLoader.js'),
      import('three/examples/jsm/controls/OrbitControls.js')
    ]);

    this.THREE = THREE;
    this.STLLoader = STLLoader;
    this.OrbitControls = OrbitControls;
  },

  setupScene() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Scene
    this.scene = new this.THREE.Scene();
    this.scene.background = new this.THREE.Color(0x0a0a0a);

    // Camera
    this.camera = new this.THREE.PerspectiveCamera(40, width / height, 0.1, 1000);

    // Renderer
    this.renderer = new this.THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new this.THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new this.THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    const directionalLight2 = new this.THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    this.scene.add(directionalLight2);

    // Controls
    this.controls = new this.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.autoRotate = false;

    this.controls.addEventListener('start', () => {
      this.isUserInteracting = true;
      this.autoRotationEnabled = false;
    });

    this.controls.addEventListener('end', () => {
      this.isUserInteracting = false;
      setTimeout(() => {
        if (!this.isUserInteracting) {
          this.autoRotationEnabled = true;
        }
      }, 2000);
    });
  },

  async loadModel() {
    const loader = new this.STLLoader();
    const modelUrl = './src/assets/3d/3d-model.stl';

    return new Promise((resolve, reject) => {
      loader.load(
        modelUrl,
        (geometry) => {
          this.material = new this.THREE.MeshPhongMaterial({
            color: 0xcccccc,
            specular: 0x555555,
            shininess: 30,
            wireframe: true,
            opacity: 0.85,
            transparent: true
          });

          this.mesh = new this.THREE.Mesh(geometry, this.material);
          geometry.center();
          this.mesh.scale.set(0.1, 0.1, 0.1);
          this.mesh.position.x += 0.5;
          this.scene.add(this.mesh);

          // Adjust camera
          const box = new this.THREE.Box3().setFromObject(this.mesh);
          const center = box.getCenter(new this.THREE.Vector3());
          const size = box.getSize(new this.THREE.Vector3());

          this.camera.position.set(
            center.x + size.x * -1.25 * 0.75 - 1,
            center.y - size.y * -5 * 0.75,
            center.z + size.z * -1 * 0.75
          );
          this.camera.lookAt(center);

          if (this.loadingIndicator) this.loadingIndicator.style.display = 'none';

          this.animate();
          resolve();
        },
        undefined,
        (error) => {
          console.error('Error loading 3D model:', error);
          if (this.loadingIndicator) {
            this.loadingIndicator.innerHTML = '<div class="text-xs text-red-400">Failed to load 3D model</div>';
          }
          reject(error);
        }
      );
    });
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    if (this.mesh && this.autoRotationEnabled && !this.isUserInteracting) {
      const rotationAxis = new this.THREE.Vector3(0.1, 0, 1).normalize();
      this.mesh.rotateOnAxis(rotationAxis, 0.01);
    }

    this.renderer.render(this.scene, this.camera);
  },

  setupResize() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      // Debounce resize for performance
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = this.container.clientWidth;
        const newHeight = this.container.clientHeight;

        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newWidth, newHeight);
      }, 250);
    }, { passive: true });
  }
};
