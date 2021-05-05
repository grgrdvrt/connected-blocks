import {dom, svg} from "../utils/dom";
import {
    lerp,
    lerpPts,
    isInRectangle,
} from "../utils/maths";
import LinkHead, {headTypes} from "./LinkHead";

export default class Link{
    constructor(context, origin, target){
        this.context = context;
        this.origin = origin;
        this.target = target;

        this.isSelected = false;
        this.isDashed = false;

        this.initDom();
    }

    initDom(){
        this.line = svg("path", {attributes:{
            fill:"none",
        }});
        this.shadowLine = svg("path", {attributes:{
            fill:"none",
            stroke:"transparent",
            "stroke-width":10
        }});
        this.headOrigin = new LinkHead(this);
        this.headTarget = new LinkHead(this);
        const types = Object.values(headTypes);
        this.dom = svg("g", {
            classes:"link",
            attributes:{
                fill:"#ffffff",
                stroke:"#777777",
                "stroke-width":"2",
            },
            children:[
                this.shadowLine,
                this.line,
                this.headOrigin.dom,
                this.headTarget.dom,
            ]
        });
    }

    enable(){
        this.dom.addEventListener("click", this.onClick);
    }

    disable(){
        this.dom.removeEventListener("click", this.onClick);
    }

    onClick = e => {
        if(this.isSelected){
            this.context.selection.removeLink(this);
        }
        else{
            this.context.selection.setLinks([this]);
        }
    }

    select(){
        this.isSelected = true;
        this.dom.classList.add("selected");
        this.context.linkMenu.open(this);
    }

    deselect(){
        this.isSelected = false;
        this.dom.classList.remove("selected");
        this.context.linkMenu.close();
    }

    setDashed(isDashed){
        this.isDashed = isDashed;
        this.line.setAttributeNS(null, "stroke-dasharray", this.isDashed ? "4" : "");
        this.context.linkMenu.updateDashButton();
    }

    update(){
        const r1 = this.origin.getRect();
        const r2 = this.target.getRect();

        const center1 = {
            x:r1.x + 0.5 * r1.width,
            y:r1.y + 0.5 * r1.height,
        };
        const center2 = {
            x: r2.x + 0.5 * r2.width,
            y: r2.y + 0.5 * r2.height,
        };
        const inter1 = boxSegmentIntersection(r1, center1, center2);
        const inter2 = boxSegmentIntersection(r2, center1, center2);

        if(inter1 && inter2){
            const {pt:i1, norm:n1, rot:r1} = inter1;
            const {pt:i2, norm:n2, rot:r2} = inter2;
            const c1 = {
                x:lerp(i1.x, i2.x, Math.abs(n1.x) * 0.3),
                y:lerp(i1.y, i2.y, Math.abs(n1.y) * 0.3),
            };
            const c2 = {
                x:lerp(i2.x, i1.x, Math.abs(n2.x) * 0.3),
                y:lerp(i2.y, i1.y, Math.abs(n2.y) * 0.3),
            };

            this.headOrigin.update(i1.x, i1.y, r1, n1);
            this.headTarget.update(i2.x, i2.y, r2, n2);
            const size1 = this.headOrigin.getSize();
            const size2 = this.headTarget.getSize();
            const d = [
                "M", i1.x + size1 * n1.x, i1.y + size1 * n1.y,
                "C", c1.x, c1.y,
                c2.x, c2.y,
                i2.x + size2 * n2.x, i2.y + size2 * n2.y,
            ].join(" ");

            this.line.setAttributeNS(null, "d", d);
            this.shadowLine.setAttributeNS(null, "d", d);
        }
        else{
            this.shadowLine.setAttributeNS(null, "d", "");
            this.line.setAttributeNS(null, "d", "");
        }
    }

    setMemento(memento){
        this.headOrigin.setType(headTypes[memento.origin.type]);
        this.headTarget.setType(headTypes[memento.target.type]);
        this.setDashed(memento.isDashed);
    }

    getMemento(){
        return {
            origin:{id:this.origin.id, type:this.headOrigin.type.name},
            target:{id:this.target.id, type:this.headTarget.type.name},
            isDashed:this.isDashed,
        };
    }
}



function boxSegmentIntersection(box, p1, p2){
    const candidates = [
        {edge:box.x, a:p1.x, b:p2.x, norm:{x:-1, y:0}, rot:0},
        {edge:box.x + box.width, a:p1.x, b:p2.x, norm:{x:1, y:0}, rot:180},
        {edge:box.y, a:p1.y, b:p2.y, norm:{x:0, y:-1}, rot:90},
        {edge:box.y + box.height, a:p1.y, b:p2.y, norm:{x:0, y:1}, rot:-90},
    ];

    for(let i = 0; i < candidates.length; i++){
        const candidate = candidates[i];
        const t = borderSegmentIntersection(candidate.edge, candidate.a, candidate.b);
        const pt = lerpPts(p1, p2, t);
        if(isInRectangle(box, pt)){
            return {norm:candidate.norm, rot:candidate.rot, pt};
        }
    }
    return null;
}

function borderSegmentIntersection(x, a, b){
    const diff = b - a;
    if(diff !== 0){
        const t = (x - a) / diff;
        if(t >= 0 && t <= 1) {
            return t;
        }
    }
    return undefined;
}
