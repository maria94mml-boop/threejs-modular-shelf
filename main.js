import MaterialManager from './js/MaterialManager.js';
import UIManager from './js/UIManager.js';
import ProductLogic from './js/ProductLogic.js';

let scene, camera, renderer, chair, controls;
let materialManager, productLogic, uiManager;

init();
animate();

/**
 * Función de inicialización de la escena   
 */
function init() {

    /**Creación de la escena */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f2f2);

    /**Utilización de helpers */
    const grid = new THREE.GridHelper(100, 10);
    scene.add(grid);
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    /**Configuración de la cámara */
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,100,50);
    camera.lookAt(0,0,0);

    /**Configuración del renderer */
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /** Creación de un cubo ejemplo */
    const geometry = new THREE.BoxGeometry(20,20,20);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    /**Configuración de luces AmbientLight y DirectionalLight */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(5, 10, 5);
    scene.add(dir);

}  

/** Función de animación */
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera); 
}

