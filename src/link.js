import {svg} from "./utils/dom";
import {lerp} from "./utils/maths";

export default class link{
    constructor(origin, target){
        this.origin = origin;
        this.target = target;

        this.initDom();
    }

    initDom(){
        this.dom = svg("path", {
            classes:"link",
            attributes:{
                fill:"none",
                stroke:"#333333",
                "stroke-width":"2",
            }
        });
    }

    update(){
        const r1 = this.origin.dom.getBoundingClientRect();
        const r2 = this.target.dom.getBoundingClientRect();

        const p1 = {
            x:r1.x + 0.5 * r1.width,
            y:r1.y + 0.5 * r1.height,
        };
        const p2 = {
            x: r2.x + 0.5 * r2.width,
            y: r2.y + 0.5 * r2.height,
        };
        const {pt:i1, norm:n1} = boxSegmentIntersection(r1, p1, p2);
        const {pt:i2, norm:n2} = boxSegmentIntersection(r2, p1, p2);

        const c1 = {
            x:lerp(i1.x, i2.x, n1.x * 0.3),
            y:lerp(i1.y, i2.y, n1.y * 0.3),
        };
        const c2 = {
            x:lerp(i2.x, i1.x, n2.x * 0.3),
            y:lerp(i2.y, i1.y, n2.y * 0.3),
        };

        const d = [
            "M", i1.x, i1.y,
            "C", c1.x, c1.y,
            c2.x, c2.y,
            i2.x, i2.y,
        ].join(" ");

        this.dom.setAttributeNS(null, "d", d);
    }
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
        {pt:vBorderSegmentIntersection(box.x, p1, p2), norm:{x:1, y:0}},
        {pt:vBorderSegmentIntersection(box.x + box.width, p1, p2), norm:{x:1, y:0}},
        {pt:hBorderSegmentIntersection(box.y, p1, p2), norm:{x:0, y:1}},
        {pt:hBorderSegmentIntersection(box.y + box.height, p1, p2), norm:{x:0, y:1}},
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
