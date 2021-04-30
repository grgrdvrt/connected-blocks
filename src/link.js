import {svg} from "./utils/dom";

export default class link{
    constructor(origin, target){
        this.origin = origin;
        this.target = target;

        this.initDom();
    }

    initDom(){
        this.dom = svg("line", {
            classes:"link",
            attributes:{
                stroke:"black",
                "stroke-width":"2",
            }
        });
    }

    update(){
        const r1 = this.origin.dom.getBoundingClientRect();
        const r2 = this.target.dom.getBoundingClientRect();

        this.dom.setAttributeNS(null, "x1", r1.x + 0.5 * r1.width);
        this.dom.setAttributeNS(null, "y1", r1.y + 0.5 * r1.height);

        this.dom.setAttributeNS(null, "x2", r2.x + 0.5 * r2.width);
        this.dom.setAttributeNS(null, "y2", r2.y + 0.5 * r2.height);
    }
}
