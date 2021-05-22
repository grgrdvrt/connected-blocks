import {dom} from "../utils/dom";
import {rectsBounding} from "../utils/maths";
import {linkIcon, deleteIcon} from "../utils/icons";

export default class BoxMenu{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.lineBtn = dom({
            type:"button",
            children:[linkIcon()],
            classes:"boxMenu-lineBtn",
        });
        this.deleteBtn = dom({
            type:"button",
            children:[deleteIcon()],
            classes:"boxMenu-deleteBtn",
        });
        this.colorBtn = dom({
            type:"input",
            classes:"colorSelector",
            attributes:{
                type:"color",
            }
        });
        this.dom = dom({
            classes:"boxMenu closed",
            children:[
                this.lineBtn,
                this.deleteBtn,
                this.colorBtn,
            ]
        });
    }

    setBoxes(boxes){
        this.boxes = boxes;
        this.update();
    }

    open(){
        this.enable();
        this.dom.classList.remove("closed");
    }

    close(){
        this.disable();
        this.dom.classList.add("closed");
    }

    update(){
        this.colorBtn.value = this.boxes[0].color;

        const rect = rectsBounding(this.boxes.map(box => box.getRect()));
        Object.assign(this.dom.style, {
            left:rect.x + "px",
            top:rect.y + "px",
            transform:'translateY(-110%)',
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

    onDelete = () => {
        this.context.boxesActions.deleteBoxes(this.boxes.concat());
    }

    onLineDown = () => {
        this.context.links.startCreatingLink(this.boxes[0]);
    }

    onColorChange = () => {
        const newColor = this.colorBtn.value;
        this.context.boxes.lastColor = newColor;
        this.context.boxesActions.changeBoxesColor(this.boxes, newColor);
    }

}
