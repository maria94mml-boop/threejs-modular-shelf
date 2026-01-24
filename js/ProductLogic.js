export default class ProductLogic {
    constructor(baseModule, parentGroup) {
        this.baseModule = baseModule;
        this.group = parentGroup;
        this.levels = 1;
        this.modules =[];
        this.buildShelf();
    }

    buildShelf() {
        this.modules.forEach(m => this.group.remove(m));
        this.modules = [];

        for (let i = 0; i < this.levels; i++) {
            const module = this.baseModule.clone(true);
            module.position.y = i * 30; // altura del módulo en cm
            this.group.add(module);
            this.modules.push(module);
        }
    }
}