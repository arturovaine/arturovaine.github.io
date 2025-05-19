import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import * as dat from "dat.gui";

// Main setup for Three.js
const heroCanvas = document.getElementById("hero-canvas");
const width = heroCanvas.clientWidth || window.innerWidth;
const height = heroCanvas.clientHeight || 400;

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
heroCanvas.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// GUI
const gui = new dat.GUI();
const params = {
  color: 0xffffff,
  opacity: 0.8,
  wireframe: true,
  rotation: true, // Add toggle for rotation
};

let mesh;
const rotationAxis = new THREE.Vector3(0.1, 0, 1).normalize(); // Rotation axis
const loader = new STLLoader();

loader.load("../3d-model.stl", (geometry) => {
  const material = new THREE.MeshPhongMaterial({
    color: params.color,
    specular: 0x111111,
    shininess: 200,
    opacity: params.opacity,
    transparent: true,
    wireframe: params.wireframe,
  });

  mesh = new THREE.Mesh(geometry, material);
  geometry.center();
  mesh.scale.set(0.1, 0.1, 0.1);
  mesh.position.x += 0.5; // Translate the mesh slightly to the right
  scene.add(mesh);

  // Adjust Camera Position
  const box = new THREE.Box3().setFromObject(mesh);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  camera.position.set(
    center.x + size.x * -1.25 * 0.75 - 1,
    center.y - size.y * -5 * 0.75,
    center.z + size.z * -1 * 0.75
  );
  camera.lookAt(center);

  setupGUI();
  animate();
});

// GUI Setup
function setupGUI() {
  gui.addColor(params, "color").name("Model Color").onChange((value) => {
    if (mesh) mesh.material.color.set(value);
  });

  gui.add(params, "opacity", 0, 1, 0.01).name("Opacity").onChange((value) => {
    if (mesh) {
      mesh.material.opacity = value;
      mesh.material.transparent = value < 1; // Enable transparency if opacity < 1
    }
  });

  gui.add(params, "wireframe").name("Wireframe").onChange((value) => {
    if (mesh) mesh.material.wireframe = value;
  });

  gui.add(params, "rotation").name("Rotate Mesh");
  gui.close();
}

// Handle Window Resize
window.addEventListener("resize", () => {
  const newWidth = heroCanvas.clientWidth || window.innerWidth;
  const newHeight = heroCanvas.clientHeight || 400;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (mesh && params.rotation) {
    mesh.rotateOnAxis(rotationAxis, 0.01); // Adjusted rotation orientation
  }

  renderer.render(scene, camera);
}
