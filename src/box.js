import {dom} from "./utils/dom";

import BoxMenu from "./boxMenu";

export default class Box {
    constructor(context){
        this.context = context;
        this.isSelected = false;
        this.isDragging = false;
        this.initDom();
    }

    initDom(){
        this.menu = new BoxMenu(this, this.context);
        this.input = dom({
            type:"textarea",
            classes:"box-input",
        });
        this.content = dom({classes:"box-content"});
        this.dom = dom({classes:"box", children:[
            this.menu.dom,
            this.content,
            this.input,
        ]});
    }

    enable(){
        this.enableSelection();
        this.menu.enable();
        this.content.addEventListener("dblclick", this.onEdit);
    }

    disable(){
        this.disableSelection();
        this.menu.disable();
        this.content.removeEventListener("mousedown", this.onStartDrag);
        this.content.removeEventListener("dblclick", this.onEdit);
    }

    enableSelection(){
        this.content.addEventListener("click", this.onSelect);
    }

    disableSelection(){
        this.content.removeEventListener("click", this.onSelect);
    }

    onSelect = e => {
        const isTarget = e.target === this.dom || e.target === this.content;
        if(isTarget && !this.isDragging){
            this.toggleSelected();
        }
    }

    onEdit = () => {
        this.enableEdition();
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

    setContent(content){
        this.input.value = content;
        this.content.innerHTML = content.replace(/\n/g, "<br>");
    }

    select(){
        this.isSelected = true;
        this.dom.classList.add("selected");
        this.content.addEventListener("mousedown", this.onStartDrag);
    }

    deselect(){
        this.isSelected = false;
        this.isDragging = false;
        this.dom.classList.remove("selected");
        this.content.removeEventListener("mousedown", this.onStartDrag);
        this.endEdition();
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

    enableEdition(){
        this.dom.classList.add("edition");
        this.addToSelection();
        this.disableSelection();
        this.input.focus();
    }

    disableEdition(){
        this.dom.classList.remove("edition");
        this.enableSelection();
    }

    endEdition(){
        this.disableEdition();
        const content = this.input.value.replace(/\n/g, "<br>");
        this.content.innerHTML = content;
        this.context.links.update();
    }

    cancelEdition(){
        this.disableEdition();
    }
}
