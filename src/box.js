import {dom} from "./utils/dom";

import BoxMenu from "./boxMenu";

export default class Box {
    constructor(context){
        this.context = context;
        this.inputContent = "";
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
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
        this.dom = dom({
            classes:"box",
            children:[
                this.menu.dom,
                this.content,
                this.input,
            ]
        });
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
            if(this.context.selection.boxes.length > 1 && !e.shiftKey){
                this.context.selection.set([this]);
            }
            else if(this.isSelected){
                this.context.selection.removeBox(this);
            }
            else if(e.shiftKey){
                this.context.selection.addBox(this);
            }
            else{
                this.context.selection.set([this]);
            }
        }
    }

    onEdit = () => {
        this.enableEdition();
    }

    setContent(content){
        this.inputContent = content;
        this.input.value = content;
        this.displayContent();
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
        this.context.selection.addBox(this);
        this.disableSelection();
        this.input.focus();

        this.input.addEventListener("keyup", this.onEditionKeyUp);
    }

    disableEdition(){
        this.dom.classList.remove("edition");
        this.enableSelection();
        this.input.removeEventListener("keyup", this.onEditionKeyUp);
    }

    onEditionKeyUp = e => {
        switch(e.key){
            case "Escape":
                e.preventDefault();
                this.cancelEdition();
                break;
            case "Enter":
                if(!e.shiftKey){
                    this.endEdition();
                }
                break;
        }
    }

    endEdition(){
        this.disableEdition();
        this.inputContent = this.input.value;
        this.displayContent();
    }

    cancelEdition(){
        this.input.value = this.inputContent;
        this.disableEdition();
    }

    displayContent(){
        const content = this.inputContent.replace(/  \n/g, "<br>");
        if(content !== this.content.innerHTML){
            this.content.innerHTML = content;
            this.context.links.getRelatedLinks(this)
                .forEach(link => link.update());
        }
    }

    getRect(){
        const bcr = this.dom.getBoundingClientRect();
        return {
            x:bcr.x - this.context.stage.x,
            y:bcr.y - this.context.stage.y,
            width:bcr.width,
            height:bcr.height,
        };
    }

    setMemento(memento){
        this.x = memento.x;
        this.y = memento.y;
        this.width = memento.width;
        this.height = memento.height;
        this.setContent(memento.content);
    }

    getMemento(){
        return {
            x:this.x,
            y:this.y,
            width:this.width,
            height:this.height,
            content:this.inputContent
        };
    }
}
