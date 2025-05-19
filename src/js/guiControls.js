import * as dat from "dat.gui";

export function setupGUI(mesh, material) {
  const gui = new dat.GUI();
  const params = {
    color: material.color.getHex(),
    opacity: material.opacity,
    wireframe: material.wireframe,
  };

  gui.addColor(params, "color").onChange((value) => {
    material.color.set(value);
  });

  gui.add(params, "opacity", 0, 1, 0.01).onChange((value) => {
    material.opacity = value;
    material.transparent = value < 1; // Set transparency if opacity < 1
  });

  gui.add(params, "wireframe").onChange((value) => {
    material.wireframe = value;
  });
}
