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

    addLink(origin, target){
        const link = new Link(origin, target);
        this.links.push(link);
        this.dom.appendChild(link.dom);
        link.update();
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
