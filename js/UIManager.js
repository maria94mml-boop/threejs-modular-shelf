export default class UIManager{
    constructor(productLogic) {
        this.productLogic = productLogic;

        this.addBtn = document.getElementById("addLevel");
        this.removeBtn = document.getElementById("removeLevel");
        this.levelLabel = document.getElementById("levelCount");
        this.widthLabel = document.getElementById("dimWidth");
        this.depthLabel = document.getElementById("dimDepth");
        this.moduleHeightLabel = document.getElementById("dimModuleHeight");
        this.heightInput = document.getElementById("heightInput");

        this.bindEvents();
        this.updateUI();
    }

    /** Vincula los eventos de los controles UI */
    bindEvents() {
        if (this.addBtn) {
        this.addBtn.onclick = () => {
            this.productLogic.addLevel();
            this.updateUI();
        };
        }

        if (this.removeBtn) {
        this.removeBtn.onclick = () => {
            this.productLogic.removeLevel();
            this.updateUI();
        };
        }
        if (this.heightInput) {
            this.heightInput.onchange = () => {
                const value = Number(this.heightInput.value);
                if (value > 0) {
                this.productLogic.setHeight(value);
                this.updateUI();
                }
            };
        }
    }

    /** Actualiza los valores mostrados en la UI */
    updateUI() {
        const dims = this.productLogic.getDimensions();

        if (this.levelLabel) {
            this.levelLabel.textContent = dims.levels;
        }

        if (this.widthLabel) {
            this.widthLabel.textContent = dims.width;
        }

        if (this.depthLabel) {
            this.depthLabel.textContent = dims.depth;
        }

        if (this.moduleHeightLabel) {
            this.moduleHeightLabel.textContent = dims.moduleHeight;
        }

        if (this.heightInput) {
            this.heightInput.value = dims.totalHeight;
        }
    }

    
}
