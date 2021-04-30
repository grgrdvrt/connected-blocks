import dom from "./utils/dom";

export default class Box {
    constructor(context){
        this.context = context;
        this.isSelected = false;
        this.isDragging = false;
        this.initDom();
    }

    initDom(){
        this.dom = dom({classes:["box"]});
    }

    enable(){
        this.dom.addEventListener("click", this.onClick);
    }

    onClick = () => {
        if(!this.isDragging){
            this.toggleSelected();
        }
    }

    toggleSelected(){
        if(this.isSelected){
            this.removeFromSelection();
        }
        else{
            this.addToSelection();
        }
    }

    addToSelection(){
        this.context.selection.addBox(this);
    }

    removeFromSelection(){
        this.context.selection.removeBox(this);
    }

    select(){
        this.isSelected = true;
        this.dom.classList.add("selected");
        this.dom.addEventListener("mousedown", this.onStartDrag);
    }

    deselect(){
        this.isSelected = false;
        this.isDragging = false;
        this.dom.classList.remove("selected");
        this.dom.removeEventListener("mousedown", this.onStartDrag);
    }

    onStartDrag = e => {
        this.isDragging = false;
        this.context.selection.startDrag(e.pageX, e.pageY);
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
        this.dom.style.left = this.x + "px";
        this.dom.style.top = this.y + "px";
    }

    setSize(width, height){
        this.width = width;
        this.height = height;
        this.dom.style.width = this.width + "px";
        this.dom.style.height = this.height + "px";
    }
}
