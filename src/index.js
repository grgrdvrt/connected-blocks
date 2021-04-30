import dom from "./utils/dom";
import Box from "./box";
class Main {
    constructor(){
        this.stage = dom();
        document.body.appendChild(this.stage);

        this.boxes = [];
        this.addBox(100, 50);
    }

    addBox(x, y){
        const box = new Box();
        box.setSize(50, 50);
        box.setPosition(x, y);
        box.enable();
        this.boxes.push(box);
        this.stage.appendChild(box.dom);
    }
}

new Main();
