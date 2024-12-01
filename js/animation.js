export function animate(scene, camera, renderer) {
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}
