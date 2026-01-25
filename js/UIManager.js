export default class UIManager{
    constructor(productLogic) {
        this.productLogic = productLogic;

        this.addBtn = document.getElementById("addLevel");
        this.removeBtn = document.getElementById("removeLevel");
        this.levelLabel = document.getElementById("levelCount");
        this.widthLabel = document.getElementById("dimWidth");
        this.depthLabel = document.getElementById("dimDepth");
        this.moduleHeightLabel = document.getElementById("dimModuleHeight");
        this.totalHeightLabel = document.getElementById("dimTotalHeight");


        this.bindEvents();
        this.updateUI();
    }

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
    }

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

        if (this.totalHeightLabel) {
            this.totalHeightLabel.textContent = dims.totalHeight;
        }
    }

    
}
