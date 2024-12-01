import * as dat from 'dat.gui';

export function setupGUI(scene) {
    const gui = new dat.GUI();
    const params = {
        color: 0xffffff,
        opacity: 0.8,
        wireframe: true,
        rotation: true,
    };

    gui.addColor(params, 'color').name('Model Color');
    gui.add(params, 'opacity', 0, 1, 0.01).name('Opacity');
    gui.add(params, 'wireframe').name('Wireframe');
    gui.add(params, 'rotation').name('Rotate Mesh');

    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '70px';
    gui.domElement.style.right = '20px';

    return gui;
}
