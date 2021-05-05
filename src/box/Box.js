import {dom,} from "../utils/dom";

import BoxMenu from "./BoxMenu";
import BoxContent from "./BoxContent";

export default class Box {
    constructor(context){
        this.context = context;
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.isSelected = false;
        this.isDragging = false;
        this.color = "#000000";
        this.initDom();
    }

    initDom(){
        this.menu = new BoxMenu(this.context, this);
        this.content = new BoxContent(this.context, this);
        this.dom = dom({
            classes:"box",
            children:[
                this.menu.dom,
                this.content.dom,
            ]
        });
    }

    enable(){
        this.enableSelection();
        this.menu.enable();
        this.content.enable();
    }

    disable(){
        this.disableSelection();
        this.menu.disable();
        this.content.disable();
        this.content.display.removeEventListener("mousedown", this.onStartDrag);
    }

    enableSelection(){
        this.content.display.addEventListener("click", this.onSelect);
    }

    disableSelection(){
        this.content.display.removeEventListener("click", this.onSelect);
    }

    onSelect = e => {
        const isTarget = e.target === this.dom || e.target === this.content.display;
        if(isTarget && !this.isDragging){
            if(this.context.selection.boxes.length > 1 && !e.shiftKey){
                this.context.selection.setBoxes([this]);
            }
            else if(this.isSelected){
                this.context.selection.removeBox(this);
            }
            else if(e.shiftKey){
                this.context.selection.addBox(this);
            }
            else{
                this.context.selection.setBoxes([this]);
            }
        }
    }

    setContent(content){
        this.content.setValue(content);
    }

    select(){
        this.isSelected = true;
        this.dom.classList.add("selected");
        this.menu.setColor(this.color);
        this.content.display.addEventListener("mousedown", this.onStartDrag);
        this.startListeningResize();
    }

    deselect(){
        this.isSelected = false;
        this.isDragging = false;
        this.dom.classList.remove("selected");
        this.content.display.removeEventListener("mousedown", this.onStartDrag);
        this.stopListeningResize();
        this.content.endEdition();
    }

    startListeningResize(){
        let {width, height} = this.content.dom.style;
        if(!width || !height){
            const rect = this.content.dom.getBoundingClientRect();
            if(!width)width = rect.width + "px";
            if(!height)height = rect.height + "px";
        }
        this.lastContentSize = {width, height};
        this.initialContentSize = {...this.lastContentSize};
        this.onResizeRaf();
    }

    stopListeningResize(){
        const {width, height} = this.content.dom.style;
        const {width:oldWidth, height:oldHeight} = this.initialContentSize;
        if((width || height) && (width !== oldWidth || height !== oldWidth)){
            this.context.undoStack.addAction({
                description:"resize box",
                undo:() => {
                    Object.assign(this.content.dom.style, {
                        width:oldWidth,
                        height:oldHeight,
                    });
                    this.updateRelatedLinks();
                },
                redo:() => {
                    Object.assign(this.content.dom.style, {
                        width:width,
                        height:height,
                    });
                    this.updateRelatedLinks();
                }
            });
        }
        cancelAnimationFrame(this.resizeRaf);
    }

    onResizeRaf = () => {
        const {width, height} = this.content.dom.style;
        if(width !== this.lastContentSize.width || height !== this.lastContentSize.height){
            this.updateRelatedLinks();
        }
        this.lastContentSize = {width, height};
        this.resizeRaf = requestAnimationFrame(this.onResizeRaf);
    }

    onStartDrag = e => {
        this.isDragging = false;
        this.context.selection.startDrag(e.pageX, e.pageY);
    }

    setColor(color = "#000000"){
        this.color = color;
        Object.assign(this.dom.style, {
            color:color,
            backgroundColor:color + "11",
        });
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
        this.dom.style.left = this.x + "px";
        this.dom.style.top = this.y + "px";
    }

    updateRelatedLinks(){
        this.context.links.getRelatedLinks(this)
            .forEach(link => link.update());
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
        this.content.setValue(memento.content);
        this.setColor(memento.color);
    }

    getMemento(){
        return {
            x:this.x,
            y:this.y,
            content:this.content.value,
            color:this.color,
        };
    }
}
