import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

class ModelViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupThreeJS();
  }

  setupThreeJS() {
    const container = this.shadowRoot.querySelector('.model-viewer__canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

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

    // Load model
    const loader = new STLLoader();
    const modelUrl = 'src/assets/3d/3d-model.stl';

    loader.load(modelUrl, (geometry) => {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x111111,
        shininess: 200,
        opacity: 0.8,
        transparent: true,
        wireframe: true
      });

      this.mesh = new THREE.Mesh(geometry, material);
      geometry.center();
      this.mesh.scale.set(0.1, 0.1, 0.1);
      this.mesh.position.x += 0.5;
      this.scene.add(this.mesh);

      // Adjust camera position
      const box = new THREE.Box3().setFromObject(this.mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

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

    if (this.mesh) {
      const rotationAxis = new THREE.Vector3(0.1, 0, 1).normalize();
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
          border-radius: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: background-color var(--transition-time, 0.7s) ease;
        }
        .model-viewer__canvas {
          width: 100%;
          height: 400px;
        }
        .model-viewer__description {
          padding: 20px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--light-text-secondary, #575757);
          border-top: 1px solid var(--light-text-secondary, #575757);
          transition: color var(--transition-time, 0.7s) ease;
        }
        .model-viewer__link {
          color: var(--accent-light, #f7d039);
          text-decoration: none;
          transition: color var(--transition-time, 0.7s) ease;
        }
        .model-viewer__link:hover {
          text-decoration: underline;
        }
        
        :host-context(body.dark-mode) .model-viewer {
          background-color: var(--dark-card-bg, #171f26);
        }
        :host-context(body.dark-mode) .model-viewer__description {
          color: var(--dark-text-secondary, #a3abb2);
          border-top-color: var(--dark-text-secondary, #a3abb2);
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
        <div class="model-viewer__canvas"></div>
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