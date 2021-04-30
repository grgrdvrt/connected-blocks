import Stage from "./stage";
import Box from "./box";
import Link from "./link";
import Selection from "./selection";
class Main {
    constructor(){
        this.dom = document.body;
        this.stage = new Stage(this);
        this.stage.enable();
        this.dom.appendChild(this.stage.dom);


        this.boxes = [];
        this.links = [];
        this.selection = new Selection(this);

        window.addEventListener("resize", this.onResize);

        this.initDebug();
    }

    initDebug(){
        const a = this.createBox(150, 150, "hello");
        const b = this.createBox(550, 350, "world");
        this.addLink(a, b);
    }

    startBoxCreation(x, y){
        const box = this.createBox(x, y);
        box.editionEnded.addOnce(content => {
            if(content.trim().length === 0){
                this.stage.removeBox(box);
            }
        });
        box.enableEdition();
        box.addToSelection();
    }

    createBox(x, y, defaultContent){
        const box = new Box(this);
        box.setPosition(x, y);
        box.enable();
        if(defaultContent){
            box.setContent(defaultContent);
        }
        this.boxes.push(box);
        this.stage.addBox(box);
        return box;
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

    addLink(origin, target){
        const link = new Link(origin, target);
        this.links.push(link);
        this.stage.addLink(link);
    }

    updateLinks(){
        this.links.forEach(link => link.update());
    }

    onResize = () => {
        this.stage.updateSize();
    }
}

new Main();
