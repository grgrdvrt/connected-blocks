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
        // this.setMemento({
        //     boxes:[
        //         {id:0, x:150, y:150, content:"hello"},
        //         {id:1, x:550, y:350, content:"world"},
        //         {id:2, x:250, y:400, content:"hello"},
        //         {id:3, x:650, y:450, content:"world"},
        //     ],
        //     links:[
        //         {origin:0, target:1},
        //         {origin:2, target:3},
        //     ]
        // });
        this.setMemento(JSON.parse("{\"boxes\":[{\"x\":150,\"y\":150,\"content\":\"hello\"},{\"x\":502,\"y\":132,\"content\":\"<img src=\\\"https://www.google.com/logos/doodles/2021/labour-day-2021-6753651837108920.9-l.png\\\">\\n\"},{\"x\":250,\"y\":400,\"content\":\"hello\"},{\"x\":650,\"y\":450,\"content\":\"world\"},{\"x\":896,\"y\":590,\"width\":100,\"height\":100,\"content\":\"<h5>Class</h5>\\n<hr>\\nmethod1()  \\nmethod2()  \\ntruc\"},{\"x\":704,\"y\":625,\"width\":100,\"height\":100,\"content\":\"a node\"},{\"x\":770,\"y\":788,\"width\":100,\"height\":100,\"content\":\"another node\"}],\"links\":[{\"origin\":0,\"target\":1},{\"origin\":2,\"target\":3},{\"origin\":4,\"target\":1},{\"origin\":5,\"target\":1},{\"origin\":5,\"target\":3},{\"origin\":6,\"target\":4},{\"origin\":6,\"target\":5},{\"origin\":6,\"target\":2}]}"))
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
