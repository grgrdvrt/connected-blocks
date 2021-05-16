import {dom} from "../utils/dom";
import {linkIcon, deleteIcon} from "../utils/icons";

export default class BoxMenu{
    constructor(context, box){
        this.context = context;
        this.box = box;
        this.initDom();
    }

    initDom(){
        this.lineBtn = dom({
            type:"button",
            children:[linkIcon()],
            classes:"box-menu-lineBtn",
        });
        this.deleteBtn = dom({
            type:"button",
            children:[deleteIcon()],
            classes:"box-menu-deleteBtn",
        });
        this.colorBtn = dom({
            type:"input",
            classes:"colorSelector",
            attributes:{
                type:"color",
            }
        });
        this.dom = dom({
            classes:"box-menu",
            children:[
                this.lineBtn,
                this.deleteBtn,
                this.colorBtn,
            ]
        });
    }

    enable(){
        this.lineBtn.addEventListener("mousedown", this.onLineDown);
        this.deleteBtn.addEventListener("click", this.onDelete);
        this.colorBtn.addEventListener("change", this.onColorChange);
    }

    disable(){
        this.lineBtn.removeEventListener("mousedown", this.onLineDown);
        this.deleteBtn.removeEventListener("click", this.onDelete);
        this.colorBtn.removeEventListener("change", this.onColorChange);
    }

    setColor(color){
        this.colorBtn.value = color;
    }

    onDelete = () => {
        this.context.boxesActions.deleteBox(this.box);
    }

    onLineDown = () => {
        this.context.links.startCreatingLink(this.box);
    }

    onColorChange = () => {
        const newColor = this.colorBtn.value;
        this.context.boxes.lastColor = newColor;
        this.context.boxesActions.changeBoxColor(this.box, newColor);
    }

}
