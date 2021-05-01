export function dom(params){
    params = Object.assign({type:"div"}, params);

    const element = document.createElement(params.type);
    if(params.classes){
        element.setAttribute("class", params.classes);
    }
    if(params.innerHTML){
        element.innerHTML = params.innerHTML;
    }
    if(params.children){
        params.children.forEach(element.appendChild, element);
    }
    if(params.parent){
        params.parent.appendChild(element);
    }
    if(params.attributes){
        for(let attrName in params.attributes){
            element.setAttribute(attrName, params.attributes[attrName]);
        }
    }
    return element;
}


const svgNS = "http://www.w3.org/2000/svg";
export function svg(type, params = {}){
    const element = document.createElementNS(svgNS, type);
    if(params.classes){
        element.setAttributeNS(null, "class", params.classes);
    }
    if(params.children){
        params.children.forEach(element.appendChild, element);
    }
    if(params.parent){
        params.parent.appendChild(element);
    }
    if(params.attributes){
        for(let attrName in params.attributes){
            element.setAttributeNS(null, attrName, params.attributes[attrName]);
        }
    }
    return element;
}

//https://stackoverflow.com/questions/16230720/set-the-caret-position-always-to-end-in-contenteditable-div
export function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
