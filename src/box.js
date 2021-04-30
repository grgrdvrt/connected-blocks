import {dom} from "./utils/dom";
import Signal from "./utils/signal";

export default class Box {
    constructor(context){
        this.context = context;
        this.isSelected = false;
        this.isDragging = false;
        this.editionCancelled = new Signal();
        this.editionEnded = new Signal();
        this.initDom();
    }

    initDom(){
        this.dom = dom({classes:"box"});
        this.input = dom({
            type:"textarea",
            parent:this.dom,
            classes:"box-input",
        });
        this.content = dom({parent:this.dom, classes:"box-content"});
    }

    enable(){
        this.enableSelection();
        this.content.addEventListener("dblclick", this.onEdit);
    }

    enableSelection(){
        this.content.addEventListener("click", this.onSelect);
    }

    disableSelection(){
        this.content.removeEventListener("click", this.onSelect);
    }

    onSelect = () => {
        if(!this.isDragging){
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
        this.editionEnded.dispatch(content);
        this.context.updateLinks();
    }

    cancelEdition(){
        this.disableEdition();
        this.editionCancelled.dispatch();
    }
}
