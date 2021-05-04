import Stage from "./stage";
import Boxes from "./box/Boxes";
import Links from "./link/Links";
import LinkMenu from "./link/LinkMenu";
import Selection from "./selection";
import SelectionMenu from "./SelectionMenu";
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
        this.stage.fixedDom.appendChild(this.links.dom);
        this.boxes = new Boxes(this);
        this.stage.pannableDom.appendChild(this.boxes.dom);
        this.linkMenu = new LinkMenu(this);
        this.stage.pannableDom.appendChild(this.linkMenu.dom);

        this.selectionMenu = new SelectionMenu(this);
        this.stage.pannableDom.appendChild(this.selectionMenu.dom);

        this.selection = new Selection(this);

        window.addEventListener("resize", this.onResize);
        this.onResize();

        this.initDebug();
    }

    initDebug(){
        this.setMemento(JSON.parse("{\"boxes\":[{\"x\":150,\"y\":150,\"content\":\"hello\"},{\"x\":450,\"y\":100,\"content\":\"<img src=\\\"https://grgrdvrt.com/works/delaunoids/home_thumb.jpg\\\">\\n\"},{\"x\":250,\"y\":400,\"content\":\"hello\"},{\"x\":650,\"y\":450,\"content\":\"world\"},{\"x\":896,\"y\":590,\"content\":\"<h5>Class</h5>\\n<hr>\\nmethod1()  \\nmethod2()  \\ntruc\"},{\"x\":704,\"y\":625,\"content\":\"a node\"},{\"x\":770,\"y\":788,\"content\":\"another node\"}],\"links\":[{\"origin\":{\"id\":0,\"type\":\"none\"},\"target\":{\"id\":1,\"type\":\"arrow\"}},{\"origin\":{\"id\":2,\"type\":\"none\"},\"target\":{\"id\":3,\"type\":\"arrow\"}},{\"origin\":{\"id\":4,\"type\":\"none\"},\"target\":{\"id\":1,\"type\":\"solidDiamond\"}},{\"origin\":{\"id\":5,\"type\":\"none\"},\"target\":{\"id\":1,\"type\":\"arrow\"}},{\"origin\":{\"id\":5,\"type\":\"none\"},\"target\":{\"id\":3,\"type\":\"arrow\"}},{\"origin\":{\"id\":6,\"type\":\"none\"},\"target\":{\"id\":4,\"type\":\"arrow\"}},{\"origin\":{\"id\":6,\"type\":\"none\"},\"target\":{\"id\":5,\"type\":\"arrow\"}},{\"origin\":{\"id\":6,\"type\":\"none\"},\"target\":{\"id\":2,\"type\":\"arrow\"}}]}"));

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

window.main = new Main();
