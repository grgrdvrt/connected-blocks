import {svg} from "../utils/dom";

function makeNoneHead(){
    return {d:"", size:0, fill:"none"};
}
function makeInheritanceHead(){
    const s = 8;
    return {d:`M 0 0 l -${s} -${s} v ${2 * s} l ${s} -${s}`, size:s, fill:"#ffffff"};
}
function makeUsageHead(){
    const s = 8;
    return {d:`M -${s} -${s} L 0 0 l -${s} ${s}`, size:0, fill:"none"};
}
function makeCompositionHead(){
    const s = 8;
    return {d:`M 0 0 l -${s} -${0.7 *s} -${s} ${0.7 * s} ${s} ${0.7 * s} ${s} -${0.7 * s}`, size:2 * s, fill:"#ffffff"};
}


export const headTypes = {
    none:makeNoneHead(),
    inheritance:makeInheritanceHead(),
    usage:makeUsageHead(),
    composition:makeCompositionHead(),
};

export default class LinkHead{
    constructor(){
        this.initDom();
    }

    setType(type){
        this.type = type;
        this.dom.setAttributeNS(null, "d", type.d);
        this.dom.setAttributeNS(null, "fill", type.fill);
    }

    getSize(){
        return this.type.size;
    }

    initDom(){
        this.dom = svg("path");
    }

    update(x, y, rotation){
        this.dom.setAttributeNS(null, "transform", `translate(${x}, ${y}) rotate(${rotation})`);
    }
}
