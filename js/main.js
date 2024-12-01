import { initializeScene } from './scene.js';
import { setupGUI } from './gui.js';
import { loadModel } from './loader.js';
import { animate } from './animation.js';

// Scene setup
const { scene, camera, renderer } = initializeScene();

// GUI setup
const gui = setupGUI(scene);

// Load model
loadModel(scene, camera);

// Start animation
animate(scene, camera, renderer);
