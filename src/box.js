import dom from "./utils/dom";

export default class Box {
    constructor(){
        this.isSelected = false;
        this.initDom();
    }

    initDom(){
        this.dom = dom({classes:["box"]});
    }

    enable(){
        this.dom.addEventListener("click", this.onClick);
    }

    onClick = () => {
        this.toggleSelected();
    }

    toggleSelected(){
        if(this.isSelected){
            this.deselect();
        }
        else{
            this.select();
        }
    }

    select(){
        this.isSelected = true;
        this.dom.classList.add("selected");
    }

    deselect(){
        this.isSelected = false;
        this.dom.classList.remove("selected");
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
