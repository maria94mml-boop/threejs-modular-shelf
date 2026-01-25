import MaterialManager from "./MaterialManager.js";
export default class ProductLogic {
    constructor(baseModule, parentGroup) {
        this.baseModule = baseModule;
        this.group = parentGroup;
        this.levels = 1;
        this.modules =[];
        this.MaterialManager = new MaterialManager();
        this.currentMaterial = this.MaterialManager.getMaterial("wood049");
        this.buildShelf();
    }

    setLevels(levels) {
        console.log("Ajustando niveles a:", levels);
        const safeLevels = Math.max(1, levels);
        this.levels = safeLevels;
        this.buildShelf();
        if (this.onChange) this.onChange();
    }

    buildShelf() {
        this.modules.forEach(m => this.group.remove(m));
        this.modules = [];
        


        for (let i = 0; i < this.levels; i++) {
            const module = this.baseModule.clone(true);
            module.position.y = i * 30; // altura del módulo en cm
            module.traverse(child => {
                if (child.isMesh) {
                    child.material = this.currentMaterial;
                }
            });
            this.group.add(module);
            this.modules.push(module);
        }
    }

    /** Métodos para añadir o quitar niveles */
    addLevel() {
        this.setLevels(this.levels + 1);
    }

    removeLevel() {
        this.setLevels(this.levels - 1);
    }   
}