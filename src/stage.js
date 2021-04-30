import dom from "./utils/dom";

export default class Stage{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.dom = dom({classes:["stage"]});
        this.boxesContainer = dom({parent:this.dom});
    }

    enable(){
        this.dom.addEventListener("dblclick", this.onDoubleClick);
    }

    onDoubleClick = e => {
        this.context.addBox(e.clientX, e.clientY);
    }

    addBox(box){
        this.boxesContainer.appendChild(box.dom);
    }

    updateSize(){
        this.width = this.dom.innerWidth;
        this.height = this.dom.innerHeight;
    }
}
