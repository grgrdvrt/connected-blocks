import {svg} from "./utils/dom";
import {
    lerp,
    lerpPts,
    isInRectangle,
} from "./utils/maths";

export default class Link{
    constructor(origin, target){
        this.origin = origin;
        this.target = target;

        this.initDom();
    }

    initDom(){
        this.line = svg("path", {attributes:{fill:"none",}});
        this.headOrigin = svg("path");
        this.headTarget = svg("path");
        this.dom = svg("g", {
            classes:"link",
            attributes:{
                fill:"#ffffff",
                stroke:"#777777",
                "stroke-width":"2",
            },
            children:[
                this.line,
                this.headOrigin,
                this.headTarget,
            ]
        });
    }

    update(){
        const r1 = this.origin.getRect();
        const r2 = this.target.getRect();

        const p1 = {
            x:r1.x + 0.5 * r1.width,
            y:r1.y + 0.5 * r1.height,
        };
        const p2 = {
            x: r2.x + 0.5 * r2.width,
            y: r2.y + 0.5 * r2.height,
        };
        const inter1 = boxSegmentIntersection(r1, p1, p2);
        const inter2 = boxSegmentIntersection(r2, p1, p2);


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

            const size1 = this.setHead(this.headOrigin, i1.x, i1.y, r1, makeInheritanceHead);
            const size2 = this.setHead(this.headTarget, i2.x, i2.y, r2, makeCompositionHead);
            const d = [
                "M", i1.x + size1 * n1.x, i1.y + size1 * n1.y,
                "C", c1.x, c1.y,
                c2.x, c2.y,
                i2.x + size2 * n2.x, i2.y + size2 * n2.y,
            ].join(" ");

            this.line.setAttributeNS(null, "d", d);
        }
        else{
            this.line.setAttributeNS(null, "d", "");
        }
    }

    setHead(node, x, y, rotation, headBuilder){
        const headPath = headBuilder();
        node.setAttributeNS(null, "d", headPath.d);
        node.setAttributeNS(null, "transform", `translate(${x}, ${y}) rotate(${rotation})`);
        return headPath.size;
    }

    setMemento(memento){
    }

    getMemento(){
        return {
            origin:this.origin.id,
            target:this.target.id,
        };
    }
}

function makeInheritanceHead(){
    const s = 8;
    return {d:`M 0 0 l -${s} -${s} v ${2 * s} l ${s} -${s}`, size:s};
}
function makeUsageHead(){
    const s = 8;
    return {d:`M -${s} -${s} L 0 0 l -${s} ${s}`, size:0};
}
function makeCompositionHead(){
    const s = 8;
    return {d:`M 0 0 l -${s} -${0.7 *s} -${s} ${0.7 * s} ${s} ${0.7 * s} ${s} -${0.7 * s}`, size:2 * s};
}


function boxSegmentIntersection(box, p1, p2){
    const candidates = [
        {t:() => borderSegmentIntersection(box.x, p1.x, p2.x), norm:{x:-1, y:0}, rot:0},
        {t:() => borderSegmentIntersection(box.x + box.width, p1.x, p2.x), norm:{x:1, y:0}, rot:180},
        {t:() => borderSegmentIntersection(box.y, p1.y, p2.y), norm:{x:0, y:-1}, rot:90},
        {t:() => borderSegmentIntersection(box.y + box.height, p1.y, p2.y), norm:{x:0, y:1}, rot:-90},
    ];
    for(let i = 0; i < candidates.length; i++){
        const candidate = candidates[i];
        candidate.pt = lerpPts(p1, p2, candidate.t());
        if(isInRectangle(box, candidate.pt)){
            return candidate;
        }
    }
    return null;
}

function borderSegmentIntersection(x, a, b){
    const d = b - a;
    if(d === 0) return undefined;
    else{
        const t = (x - a) / d;
        if(t < 0 || t > 1) return undefined;
        else return t;
    }
}
