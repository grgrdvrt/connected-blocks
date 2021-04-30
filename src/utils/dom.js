export default function dom(params){
    params = Object.assign({type:"div"}, params);

    let element = document.createElement(params.type);
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
