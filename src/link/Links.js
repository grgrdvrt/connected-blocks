import {svg} from "../utils/dom";
import Link from "./Link";

export default class Links{
    constructor(context){
        this.context = context;
        this.links = [];
        this.initDom();
        this.x = 0;
        this.y = 0;
    }

    initDom(){
        this.dom = svg("svg", {classes:"links"});
    }

    startCreatingLink(box){
        document.body.addEventListener("mousemove", this.onTempLinkUpdate);
        document.body.addEventListener("mouseup", this.onTempLinkReleased);
        this.originBox = box;
        this.tempLink = svg("line", {
            classes:"link",
            attributes:{
                stroke:"red",
                "stroke-width":"2",
            },
            parent:this.dom
        });
    }

    onTempLinkUpdate = e => {
        const r1 = this.originBox.getRect();
        this.tempLink.setAttributeNS(null, "x1", r1.x + 0.5 * r1.width);
        this.tempLink.setAttributeNS(null, "y1", r1.y + 0.5 * r1.height);

        this.tempLink.setAttributeNS(null, "x2", e.pageX - this.x);
        this.tempLink.setAttributeNS(null, "y2", e.pageY - this.y);
    }

    onTempLinkReleased = e => {
        document.body.removeEventListener("mousemove", this.onTempLinkUpdate);
        document.body.removeEventListener("mouseup", this.onTempLinkReleased);
        let target = e.target;
        while(target && target !== document.body){
            const box = this.context.boxes.getBoxByDom(target);
            if(box && box !== this.originBox){
                const link = this.createLink(this.originBox, box);
                const exec = () => this.addLink(link);
                const action = this.context.undoStack.addAction({
                    undo:() => {
                        this.removeLink(link);
                    },
                    redo:() => {
                        exec();
                    }
                });
                exec();

                break;
            }
            target = target.parentNode;
        }
        this.dom.removeChild(this.tempLink);
    }

    createLink(origin, target){
        const previousLink = this.links.find(link => {
            return link.origin === origin && link.target === target
                ||link.origin === target && link.target === origin;
        });
        if(previousLink){
            return previousLink;
        }
        return new Link(this.context, origin, target);
    }

    addLink(link){
        this.links.push(link);
        this.dom.appendChild(link.dom);
        link.update();
        link.enable();
        return link;
    }

    removeLink(link){
        const id = this.links.indexOf(link);
        if(id !== -1){
            this.links.splice(id, 1);
            this.dom.removeChild(link.dom);
            link.disable();
        }
    }

    update(){
        this.links.forEach(link => link.update());
    }

    getRelatedLinks(box){
        return this.links.filter(link => {
            return link.origin === box
                || link.target === box;
        });
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
        this.updateViewBox();
    }

    setSize(width, height){
        this.width = width;
        this.height = height;
        this.updateViewBox();
    }

    updateViewBox(){
        this.dom.setAttributeNS(null, "viewBox", `${-this.x} ${-this.y} ${this.width} ${this.height}`);
        this.dom.setAttributeNS(null, "width", this.width);
        this.dom.setAttributeNS(null, "height", this.height);
    }

    setMemento(memento){
        memento.forEach(linkMemento => {
            const link = this.createLink(
                this.context.boxes.getBoxById(linkMemento.origin),
                this.context.boxes.getBoxById(linkMemento.target),
            );
            this.addLink(link);
        });
    }

    getMemento(){
        return this.links.map(link => link.getMemento());
    }
}