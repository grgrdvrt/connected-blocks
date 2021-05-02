import {dom} from "../utils/dom";

export default class BoxMenu{
    constructor(context, box){
        this.context = context;
        this.box = box;
        this.initDom();
    }

    initDom(){
        this.lineBtn = dom({
            type:"button",
            innerHTML:"L",
            classes:"box-menu-lineBtn",
        });
        this.deleteBtn = dom({
            type:"button",
            innerHTML:"X",
            classes:"box-menu-deleteBtn",
        });
        this.dom = dom({
            classes:"box-menu",
            children:[
                this.lineBtn,
                this.deleteBtn,
            ]
        });
    }

    enable(){
        this.lineBtn.addEventListener("mousedown", this.onLineDown);
        this.deleteBtn.addEventListener("click", this.onDelete);
    }

    disable(){
        this.lineBtn.removeEventListener("mousedown", this.onLineDown);
        this.deleteBtn.removeEventListener("click", this.onDelete);
    }

    onDelete = () => {
        this.context.boxes.deleteBox(this.box);
    }

    onLineDown = () => {
        this.context.links.startCreatingLink(this.box);
    }

}
