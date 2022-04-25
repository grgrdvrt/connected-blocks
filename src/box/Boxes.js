import {dom, svg} from "../utils/dom";
import Box from "./Box";

export default class Boxes{
    constructor(context){
        this.context = context;
        this.nextId = 0;
        this.boxes = [];
        this.initDom();
        this.lastColor = "#000000";
    }

    initDom(){
        this.dom = dom({classes:"boxes"});
    }

    createBox(x, y, defaultContent){
        const box = new Box(this.context);
        box.id = this.nextId;
        this.nextId++;
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

	getIsEditing(){
		return this.boxes.some(box => box.content.isEditing);
	}

    getBoxByDom(dom){
        return this.boxes.find(box => box.dom === dom);
    }

    getBoxById(id){
        return this.boxes.find(box => box.id === id);
    }

    setMemento(memento){
        let maxId = this.nextId;
        const newBoxes = memento.map((boxMemento, i) => {
            const box = new Box(this.context);
            box.setMemento(boxMemento);
            if(!box.id)box.id = i;
            if(box.id >= maxId)maxId = box.id + 1;
            return box;
        });
        newBoxes.forEach(box => {
            this.addBox(box);
        });
        this.nextId = maxId + 1;
        return newBoxes;
    }

    getMemento(){
        return this.boxes.map(box => box.getMemento());
    }

    clear(){
        this.nextId = 0;
        this.boxes.forEach(box => {
            box.disable();
            this.dom.removeChild(box.dom);
        });
        this.boxes.length = 0;
        this.context.selection.clearBoxes();
    }
}
