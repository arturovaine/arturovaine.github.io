import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import * as THREE from 'three';

export function loadModel(scene, camera) {
    const loader = new STLLoader();

    loader.load(
        './assets/bionic-arm.stl',
        (geometry) => {
            console.log('STL file loaded successfully:', geometry);

            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0x111111,
                shininess: 200,
            });

            const mesh = new THREE.Mesh(geometry, material);

            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox;

            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            geometry.center(); // Center the geometry

            // Scale and position the mesh
            mesh.scale.set(0.1, 0.1, 0.1);
            mesh.position.set(-center.x, -center.y, -center.z);

            scene.add(mesh);

            // Fit the camera to the model
            const size = boundingBox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            const fov = camera.fov * (Math.PI / 180);
            const cameraZ = maxDim / (2 * Math.tan(fov / 2));

            camera.position.set(0, 0, cameraZ * 1.5);
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            console.log('Model added to the scene.');
        },
        (xhr) => {
            console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
        },
        (error) => {
            console.error('Error loading STL file:', error);
        }
    );
}
