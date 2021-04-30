import dom from "./utils/dom";
import Stage from "./stage";
import Box from "./box";
import Selection from "./selection";
class Main {
    constructor(){
        this.dom = document.body;
        this.stage = new Stage(this);
        this.stage.enable();
        this.dom.appendChild(this.stage.dom);

        this.boxes = [];
        this.addBox(100, 50);

        this.selection = new Selection(this);

        window.addEventListener("resize", this.onResize);
    }

    addBox(x, y){
        const box = new Box(this);
        box.setSize(50, 50);
        box.setPosition(x, y);
        box.enable();
        this.boxes.push(box);
        this.stage.addBox(box);
    }

    onResize = () => {
        this.stage.updateSize();
    }
}

new Main();
