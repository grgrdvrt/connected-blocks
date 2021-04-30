import {svg} from "./utils/dom";
import {lerp} from "./utils/maths";

export default class link{
    constructor(origin, target){
        this.origin = origin;
        this.target = target;

        this.initDom();
    }

    initDom(){
        this.line = svg("path", {
            classes:"link",
            attributes:{
                fill:"none",
                stroke:"#777777",
                "stroke-width":"2",
            }
        });
        this.headOrigin = svg("path", {
            classes:"link",
            attributes:{
                fill:"none",
                stroke:"#777777",
                "stroke-width":"2",
            }
        });
        this.headTarget = svg("path", {
            classes:"link",
            attributes:{
                fill:"none",
                stroke:"#777777",
                "stroke-width":"2",
            }
        });
        this.dom = svg("g", {
            classes:"link",
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

            const arr1 = makeInheritanceHead();
            // const arr2 = makeUsageHead();
            const arr2 = makeCompositionHead();
            const d = [
                "M", i1.x + arr1.size * n1.x, i1.y + arr1.size * n1.y,
                "C", c1.x, c1.y,
                c2.x, c2.y,
                i2.x + arr2.size * n2.x, i2.y + arr2.size * n2.y,
            ].join(" ");
            this.headOrigin.setAttributeNS(null, "d", arr1.d);
            this.headOrigin.setAttributeNS(null, "transform", `translate(${i1.x}, ${i1.y}) rotate(${r1})`);
            this.headTarget.setAttributeNS(null, "d", arr2.d);
            this.headTarget.setAttributeNS(null, "transform", `translate(${i2.x}, ${i2.y}) rotate(${r2})`);

            this.line.setAttributeNS(null, "d", d);
        }
        else{
            this.line.setAttributeNS(null, "d", "");
        }
    }
}

function makeInheritanceHead(x, y){
    const s = 8;
    return {d:`M 0 0 l -${s} -${s} v ${2 * s} l ${s} -${s}`, size:s};
}
function makeUsageHead(x, y){
    const s = 8;
    return {d:`M -${s} -${s} L 0 0 l -${s} ${s}`, size:0};
}
function makeCompositionHead(x, y){
    const s = 8;
    return {d:`M 0 0 l -${s} -${0.7 *s} -${s} ${0.7 * s} ${s} ${0.7 * s} ${s} -${0.7 * s}`, size:2 * s};
}

function lerpPts(p1, p2, t){
    return {
        x:lerp(p1.x, p2.x, t),
        y:lerp(p1.y, p2.y, t),
    };
}

function isInBox(box, pt){
    return pt.x >= box.x
        && pt.y >= box.y
        && pt.x <= box.x + box.width
        && pt.y <= box.y + box.height;
}

function boxSegmentIntersection(box, p1, p2){
    const candidates = [
        {pt:vBorderSegmentIntersection(box.x, p1, p2), norm:{x:-1, y:0}, rot:0},
        {pt:vBorderSegmentIntersection(box.x + box.width, p1, p2), norm:{x:1, y:0}, rot:180},
        {pt:hBorderSegmentIntersection(box.y, p1, p2), norm:{x:0, y:-1}, rot:90},
        {pt:hBorderSegmentIntersection(box.y + box.height, p1, p2), norm:{x:0, y:1}, rot:-90},
    ];
    return candidates.filter(candidate => candidate.pt && isInBox(box, candidate.pt))[0];
}

function vBorderSegmentIntersection(x, p1, p2){
    const dx = p2.x - p1.x;
    if(dx === 0){
        return undefined;
    }
    else{
        const t = (x - p1.x) / dx;
        if(t < 0 || t > 1){
            return undefined;
        }
        return lerpPts(p1, p2, t);
    }
}

function hBorderSegmentIntersection(y, p1, p2){
    const dy = p2.y - p1.y;
    if(dy === 0){
        return undefined;
    }
    else{
        const t = (y - p1.y) / dy;
        if(t < 0 || t > 1){
            return undefined;
        }
        return lerpPts(p1, p2, t);
    }
}
