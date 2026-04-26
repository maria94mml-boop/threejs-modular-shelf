import UIManager from './js/UIManager.js';
import ProductLogic from './js/ProductLogic.js';

let scene, camera, renderer, controls;
let materialManager, productLogic, uiManager;
let helpersVisible = true;


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

    /**Utilización de helpers (grid y axes) */
    const grid = new THREE.GridHelper(200, 10);
    scene.add(grid);
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    const helpersBtn = document.getElementById("toggleHelpers");

    helpersBtn.onclick = () => {
        helpersVisible = !helpersVisible;
        grid.visible = helpersVisible;
        axes.visible = helpersVisible;
    };

    /** Botones de ocultar UI */
    const hideBtn = document.getElementById("toggleHide");
    const exitHideBtn = document.getElementById("exitHide");
    const uiPanel = document.getElementById("ui");
    const sideControls = document.getElementById("side-controls");

    hideBtn.onclick = () => {
        enterHideMode(uiPanel,sideControls, exitHideBtn,grid,axes);
    };

    exitHideBtn.onclick = () => {
        exitHideMode(uiPanel,sideControls, exitHideBtn,grid,axes);
    };

    /**Configuración de la cámara */
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,36,125);

    /**Configuración del renderer */
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    /**Configuración de luces AmbientLight y DirectionalLight */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    scene.add(dir);

    /**Configuración de los controles de órbita */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 150;
    controls.maxDistance = 300;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.update();  

    /**Evento de redimensionamiento de la ventana */
    window.addEventListener('resize', onResize);

}  

/** Función de animación */
function animate(){
    requestAnimationFrame(animate);
    controls.update();
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
        handleShelfChange(productLogic, shelfGroup);
    }

    handleShelfChange(productLogic, shelfGroup);
    setupSaveWidget(productLogic);
    uiManager = new UIManager(productLogic);

    }, undefined, function(error) {
        console.error(error);
    });
}

/** Función para manejar los cambios en la estantería */
function handleShelfChange(productLogic, shelfGroup) {
    const config = getShelfConfigJSON();

    console.log("Current configuration:");
    console.log(JSON.stringify(config, null, 2));    
    frameShelf(shelfGroup);
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

    /** Parámetros para el cálculo de la posición de la cámara */
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

/** Función para entrar en el modo oculto */
function enterHideMode(uiPanel,sideControls, exitHideBtn, grid, axes) {

    /* Ocultar UI */
    uiPanel.style.display = "none";
    sideControls.style.display = "none";

    /* Ocultar helpers */
    grid.visible = false;
    axes.visible = false;

    /* Mostrar botón X */
    exitHideBtn.style.display = "block";
}

/** Función para salir del modo oculto */
function exitHideMode(uiPanel,sideControls, exitHideBtn, grid, axes) {

    /* Mostrar UI */
    uiPanel.style.display = "block";
    sideControls.style.display = "flex";

    /* Restaurar visibilidad de helpers */
    grid.visible = helpersVisible;
    axes.visible = helpersVisible;

    /* Ocultar botón X */
    exitHideBtn.style.display = "none";
}

/** Función para obtener la configuración de la estantería en formato JSON */
function getShelfConfigJSON(){
    const dims = productLogic.getDimensions();

    return {
        productId: "modular-shelf-001",
        version: "1.0",
        exportedAt: new Date().toISOString(),
        units: "cm",
        dimensions: dims
    };   
}

/** Función para configurar el widget de guardado */
function setupSaveWidget(productLogic) {
    const saveBtn = document.getElementById("saveConfig");
    const jsonWidget = document.getElementById("jsonWidget");
    const jsonOutput = document.getElementById("jsonOutput");
    const closeBtn = document.getElementById("closeJson");
    const copyBtn = document.getElementById("copyJson");
    const downloadBtn = document.getElementById("downloadJson");

    saveBtn.onclick = () => {
        const config = getShelfConfigJSON();
        jsonOutput.textContent = JSON.stringify(config, null, 2);
        jsonWidget.style.display = "flex";
    };

    closeBtn.onclick = () => {
        jsonWidget.style.display = "none";
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(jsonOutput.textContent);
    };

    downloadBtn.onclick = () => {
        const blob = new Blob([jsonOutput.textContent], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "shelf-config.json";
        a.click();
        URL.revokeObjectURL(url);
    };
}

