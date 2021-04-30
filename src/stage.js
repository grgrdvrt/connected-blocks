import {dom} from "./utils/dom";

export default class Stage{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.dom = dom({classes:["stage"]});
        this.background = dom({
            classes:"stage-background",
            parent:this.dom
        });
    }

    enable(){
        this.background.addEventListener("dblclick", this.onDoubleClick);
        this.background.addEventListener("click", this.onClick);
    }

    onDoubleClick = e => {
        this.context.boxes.startBoxCreation(e.clientX, e.clientY);
    }

    onClick = e => {
        this.context.selection.clear();
    }

    addBox(box){
        this.boxesContainer.appendChild(box.dom);
    }

    removeBox(box){
        this.boxesContainer.removeChild(box.dom);
    }

    updateSize(){
        this.width = this.dom.innerWidth;
        this.height = this.dom.innerHeight;
    }
}
