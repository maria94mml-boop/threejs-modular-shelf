import MaterialManager from './js/MaterialManager.js';
import UIManager from './js/UIManager.js';
import ProductLogic from './js/ProductLogic.js';

let scene, camera, renderer, controls;
let materialManager, productLogic, uiManager;

init();
loadShelf();
animate();

/**
 * Función de inicialización de la escena   
 */
function init() {

    /**Creación de la escena */
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2f2f2);

    /**Utilización de helpers */
    const grid = new THREE.GridHelper(200, 10);
    scene.add(grid);
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    /**Configuración de la cámara */
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,100,150);
    camera.lookAt(0,0,0);

    /**Configuración del renderer */
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    /** Creación de un cubo ejemplo */
    /*
    const geometry = new THREE.BoxGeometry(20,20,20);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);*/

    /**Configuración de luces AmbientLight y DirectionalLight */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    scene.add(dir);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.mindistance = 150;
    controls.maxDistance = 300;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.update();  
    //controls.target.set(0, 0.5, 0);
    window.addEventListener('resize', onResize);

}  

/** Función de animación */
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera); 
}

/** Función para cargar la estantería */
function loadShelf() {

    const loader = new THREE.GLTFLoader();    
    loader.load('./models/shelf_module.glb', function(glb) {
        const baseModule = glb.scene;
        baseModule.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const shelfGroup = new THREE.Group();
    scene.add(shelfGroup);

    productLogic = new ProductLogic(baseModule, shelfGroup);

    productLogic.onChange = () => {
        console.log("Configuración de la estantería cambiada.");
        frameShelf(shelfGroup);
    }

    productLogic.setLevels(6);

    

    }, undefined, function(error) {
        console.error(error);
    });
}

/** Función para ajustar la cámara a la estantería */
function frameShelf(shelfGroup) {

    if (!shelfGroup) return;

    shelfGroup.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(shelfGroup);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const MODULE_HEIGHT = 30;
    const LEVELS_PER_BLOCK = 6;
    const BLOCK_HEIGHT = LEVELS_PER_BLOCK * MODULE_HEIGHT;

    /* Calcular altura por bloques de 6 niveles */
    const realHeight = size.y;
    const blockIndex = Math.max(1, Math.ceil(realHeight / BLOCK_HEIGHT));
    const effectiveHeight = blockIndex * BLOCK_HEIGHT;

    const distance = effectiveHeight * 0.7 ;

    camera.position.set(
        center.x,
        center.y + effectiveHeight * 0.12,
        center.z + distance
    );
    console.log("Altura estantería:", size.y);

    controls.target.copy(center);
    controls.minDistance = effectiveHeight * 0.25;
    controls.maxDistance = effectiveHeight * 2;

    controls.update();

}

/** Función para manejar el redimensionamiento de la ventana */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
