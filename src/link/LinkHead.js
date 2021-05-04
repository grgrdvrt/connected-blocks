import {svg} from "../utils/dom";

function makeNoneHead(){
    return {name:"none", d:"", size:0, fill:"none"};
}
function makeTriangleHead(){
    const s = 8;
    return {
        name:"trianle",
        d:`M 0 0 l -${s} -${s} v ${2 * s} l ${s} -${s}`,
        size:s,
        fill:"#ffffff"
    };
}
function makeArrowHead(){
    const s = 8;
    return {
        name:"arrow",
        d:`M -${s} -${s} L 0 0 l -${s} ${s}`,
        size:0,
        fill:"none"
    };
}
function makeHollowDiamondHead(){
    const s = 8;
    return {
        name:"hollowDiamond",
        d:`M 0 0 l -${s} -${0.7 *s} -${s} ${0.7 * s} ${s} ${0.7 * s} ${s} -${0.7 * s}`,
        size:2 * s,
        fill:"#ffffff"
    };
}
function makeSolidDiamondHead(){
    const s = 8;
    return {
        name:"solidDiamond",
        d:`M 0 0 l -${s} -${0.7 *s} -${s} ${0.7 * s} ${s} ${0.7 * s} ${s} -${0.7 * s}`,
        size:2 * s,
        fill:"#777777"
    };
}


export const headTypes = {
    none:makeNoneHead(),
    triangle:makeTriangleHead(),
    arrow:makeArrowHead(),
    hollowDiamond:makeHollowDiamondHead(),
    solidDiamond:makeSolidDiamondHead(),
};

export default class LinkHead{
    constructor(link){
        this.link = link;
        this.initDom();
    }

    initDom(){
        this.dom = svg("path");
    }

    setType(type){
        this.type = type;
        this.dom.setAttributeNS(null, "d", type.d);
        this.dom.setAttributeNS(null, "fill", type.fill);
    }

    getSize(){
        return this.type.size;
    }

    getTypeId(){
        return Object.values(headTypes).indexOf(this.type);
    }

    update(x, y, rotation, normal){
        this.x = x + normal.x;
        this.y = y + normal.y;
        this.rotation = rotation;
        this.normal = normal;
        this.dom.setAttributeNS(null, "transform", `translate(${x}, ${y}) rotate(${rotation})`);
    }
}
