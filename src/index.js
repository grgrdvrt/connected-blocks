import Stage from "./stage";
import Boxes from "./boxes";
import Links from "./links";
import Selection from "./selection";
import UndoStack from "./undoStack";

class Main {
    constructor(){
        this.dom = document.body;
        this.stage = new Stage(this);
        this.stage.enable();
        this.dom.appendChild(this.stage.dom);

        this.undoStack = new UndoStack(this);
        this.undoStack.enable();

        this.links = new Links(this);
        this.dom.appendChild(this.links.dom);
        this.boxes = new Boxes(this);
        this.dom.appendChild(this.boxes.dom);

        this.selection = new Selection(this);

        window.addEventListener("resize", this.onResize);

        this.initDebug();
    }

    initDebug(){
        this.links.addLink(this.links.createLink(
            this.boxes.addBox(this.boxes.createBox(150, 150, "hello")),
            this.boxes.addBox(this.boxes.createBox(550, 350, "world"))
        ));
        this.links.addLink(this.links.createLink(
            this.boxes.addBox(this.boxes.createBox(250, 350, "hello")),
            this.boxes.addBox(this.boxes.createBox(650, 450, "world")),
        ));
    }


    onResize = () => {
        this.stage.updateSize();
    }
}

new Main();
