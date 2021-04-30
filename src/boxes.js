import {dom, svg} from "./utils/dom";
import Box from "./box";
export default class Boxes{
    constructor(context){
        this.context = context;
        this.boxes = [];
        this.initDom();
    }

    initDom(){
        this.dom = dom({classes:"boxes"});
    }

    startBoxCreation(x, y){
        const box = this.createBox(x, y);
        box.enableEdition();
        box.addToSelection();
    }

    createBox(x, y, defaultContent){
        const box = new Box(this.context);
        box.setPosition(x, y);
        box.enable();
        if(defaultContent){
            box.setContent(defaultContent);
        }
        this.boxes.push(box);
        this.dom.appendChild(box.dom);
        return box;
    }

    deleteBox(box){
        box.disable();
        this.context.selection.removeBox(box);
        const id = this.boxes.indexOf(box);
        if(id !== -1){
            this.boxes.splice(id, 1);
            this.dom.removeChild(box.dom);
        }
        const links = this.context.links.getRelatedLinks(box);
        links.forEach(link => this.context.links.removeLink(link));
    }

    getBoxByDom(dom){
        return this.boxes.find(box => box.dom === dom);
    }
}
