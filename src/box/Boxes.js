import {dom, svg} from "../utils/dom";
import Box from "./Box";

let nextId = 0;
export default class Boxes{
    constructor(context){
        this.context = context;
        this.boxes = [];
        this.initDom();
        this.lastColor = "#000000";
    }

    initDom(){
        this.dom = dom({classes:"boxes"});
    }

    startBoxCreation(x, y){
        const box = this.createBox(x, y);
        this.context.selection.setBoxes([box]);

        const exec = () => this.addBox(box);
        this.context.undoStack.addAction({
            description:"add box",
            undo:() => {
                this.removeBox(box);
            },
            redo:() => {
                exec();
            },
        });
        exec();
        box.content.enableEdition();
    }

    createBox(x, y, defaultContent){
        const box = new Box(this.context);
        box.id = nextId;
        nextId++;
        box.setPosition(x, y);
        if(defaultContent){
            box.setContent(defaultContent);
        }
        box.setColor(this.lastColor);
        return box;
    }

    addBox(box){
        box.enable();
        this.boxes.push(box);
        this.dom.appendChild(box.dom);
        return box;
    }

    removeBox(box){
        box.disable();
        this.context.selection.removeBox(box);

        const id = this.boxes.indexOf(box);
        if(id !== -1){
            this.boxes.splice(id, 1);
            this.dom.removeChild(box.dom);
        }
    }

    deleteBox(box){
        const links = this.context.links.getRelatedLinks(box);
        const exec = () => {
            this.removeBox(box);
            links.forEach(link => this.context.links.removeLink(link));
        };
        this.context.undoStack.addAction({
            description:"delete box",
            undo:() => {
                this.addBox(box);
                links.forEach(link => this.context.links.addLink(link));
            },
            redo:() => {
                exec();
            }
        });
        exec();
    }

    getBoxByDom(dom){
        return this.boxes.find(box => box.dom === dom);
    }

    getBoxById(id){
        return this.boxes.find(box => box.id === id);
    }

    setMemento(memento){
        memento.forEach((boxMemento, i) => {
            const box = new Box(this.context);
            box.setMemento(boxMemento);
            box.id = i;
            this.addBox(box);
        });
        nextId = this.boxes[this.boxes.length - 1].id + 1;
    }

    getMemento(){
        return this.boxes.map(box => box.getMemento());
    }
}
