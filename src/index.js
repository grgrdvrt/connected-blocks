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
        this.stage.dom.appendChild(this.links.dom);
        this.boxes = new Boxes(this);
        this.stage.dom.appendChild(this.boxes.dom);

        this.selection = new Selection(this);

        window.addEventListener("resize", this.onResize);
        this.onResize();

        this.initDebug();
    }

    initDebug(){
        this.setMemento({
            boxes:[
                {id:0, x:150, y:150, content:"hello"},
                {id:1, x:550, y:350, content:"world"},
                {id:2, x:250, y:400, content:"hello"},
                {id:3, x:650, y:450, content:"world"},
            ],
            links:[
                {origin:0, target:1},
                {origin:2, target:3},
            ]
        });
    }


    onResize = () => {
        this.stage.updateSize();
        this.links.setSize(this.stage.width, this.stage.height);
    }

    setMemento(memento){
        this.boxes.setMemento(memento.boxes);
        this.links.setMemento(memento.links);
    }

    getMemento(){
        return {
            boxes:this.boxes.getMemento(),
            links:this.links.getMemento(),
        };
    }
}

new Main();
