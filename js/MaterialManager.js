export default class MaterialManager {
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.materials = {};
    }

    /** Carga una madera base*/ 
    loadWood049() {
        if (this.materials.wood049) {
            return this.materials.wood049;
        }

        const color = this.loader.load("./textures/structure/wood049/color.jpg");
        const normal = this.loader.load("./textures/structure/wood049/normal.jpg");
        const roughness = this.loader.load("./textures/structure/wood049/rough.jpg");

        [color, normal, roughness].forEach(tex => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(1, 1);
        });

        const material = new THREE.MeshStandardMaterial({
            map: color,
            normalMap: normal,
            roughnessMap: roughness,
            roughness: 1,
            metalness: 0
        });

        this.materials.wood049 = material;
        return material;
    }

    getMaterial(type) {
        switch (type) {
        case "wood049":
            return this.loadWood049();
        default:
            console.warn("Material no definido:", type);
            return null;
        }
    }
    
}