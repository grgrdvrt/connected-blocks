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
        this.selection = new Selection(this);

        window.addEventListener("resize", this.onResize);
    }

    createBox(x, y){
        const box = new Box(this);
        box.setPosition(x, y);
        box.enable();
        box.editionEnded.addOnce(content => {
            if(content.trim().length === 0){
                this.stage.removeBox(box);
            }
        });
        this.boxes.push(box);
        box.enableEdition();
        this.stage.addBox(box);
        box.addToSelection();
    }

    removeBox(box){
        box.disable();
        this.selection.removeBox(box);
        this.stage.removeBox(box);
        const id = this.boxes.indexOf(box);
        if(id !== -1){
            this.boxes.splice(id, 1);
        }
    }

    onResize = () => {
        this.stage.updateSize();
    }
}

new Main();
