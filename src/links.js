import {svg} from "./utils/dom";
import Link from "./link";

export default class Links{
    constructor(context){
        this.context = context;
        this.links = [];
        this.initDom();
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
        const r1 = this.originBox.dom.getBoundingClientRect();
        this.tempLink.setAttributeNS(null, "x1", r1.x + 0.5 * r1.width);
        this.tempLink.setAttributeNS(null, "y1", r1.y + 0.5 * r1.height);

        this.tempLink.setAttributeNS(null, "x2", e.pageX);
        this.tempLink.setAttributeNS(null, "y2", e.pageY);
    }

    onTempLinkReleased = e => {
        document.body.removeEventListener("mousemove", this.onTempLinkUpdate);
        document.body.removeEventListener("mouseup", this.onTempLinkReleased);
        let target = e.target;
        while(target && target !== document.body){
            const box = this.context.boxes.getBoxByDom(target);
            if(box && box !== this.originBox){
                this.addLink(this.originBox, box);
                break;
            }
            target = target.parentNode;
        }
        this.dom.removeChild(this.tempLink);
    }

    addLink(origin, target){
        const previousLink = this.links.find(link => {
            return link.origin === origin && link.target === target;
        });
        if(previousLink){
            return previousLink;
        }
        const link = new Link(origin, target);
        this.links.push(link);
        this.dom.appendChild(link.dom);
        link.update();
        return link;
    }

    removeLink(link){
        const id = this.links.indexOf(link);
        if(id !== -1){
            this.links.splice(id, 1);
            this.dom.removeChild(link.dom);
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
}
