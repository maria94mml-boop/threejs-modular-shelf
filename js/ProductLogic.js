import MaterialManager from "./MaterialManager.js";
export default class ProductLogic {
    constructor(baseModule, parentGroup) {
        this.baseModule = baseModule;
        this.group = parentGroup;

        /* Dimensiones del módulo */
        this.moduleWidth = 80;
        this.moduleDepth = 30;
        this.moduleHeight = 30;

        this.levels = 1;
        this.modules =[];

        this.materialManager = new MaterialManager();
        this.currentMaterial = this.materialManager.getMaterial("wood049");

        this.onChange = null;

        this.buildShelf();
    }

    setLevels(levels) {
        console.log("Ajustando niveles a:", levels);
        const safeLevels = Math.max(1, levels);
        this.levels = safeLevels;
        this.buildShelf();
        if (this.onChange) this.onChange();
    }

    setHeight(totalHeight) {
        const levels = Math.round(totalHeight / this.moduleHeight);
        this.setLevels(levels);
    }

    buildShelf() {
        this.group.clear();
        this.modules = [];

        for (let i = 0; i < this.levels; i++) {
            const module = this.baseModule.clone(true);
            module.position.set(0,i* this.moduleHeight, 0);
            module.traverse(child => {
                if (child.isMesh) {
                    child.material = this.currentMaterial;
                }
            });
            this.group.add(module);
            this.modules.push(module);
        }
    }
    getTotalHeight() {
        return this.levels * this.moduleHeight;
    }

    getDimensions() {
        return {
            width: this.moduleWidth,
            depth: this.moduleDepth,
            moduleHeight: this.moduleHeight,
            totalHeight: this.getTotalHeight(),
            levels: this.levels
        };
    }

    /** Métodos para añadir o quitar niveles */
    addLevel() {
        this.setLevels(this.levels + 1);
    }

    removeLevel() {
        this.setLevels(this.levels - 1);
    }   
}