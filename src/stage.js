import {dom} from "./utils/dom";
import {boxesIntersection} from "./utils/maths";

const FRICTION = 0.9;
const MIN_SPEED = 0.5;
export default class Stage{
    constructor(context){
        this.context = context;
        this.initDom();

        this.hasSelected = false;
        this.hasPanned = false;

        this.x = 0;
        this.y = 0;
    }

    initDom(){
        this.background = dom({classes:"stage-background"});
        this.selectionRect = dom({classes:"stage-selectionRect"});
        this.fixedDom = dom({classes:"stage-container"});
        this.pannableDom = dom({classes:"stage-container"});
        this.dom = dom({
            classes:"stage",
            children:[
                this.background,
                this.fixedDom,
                this.pannableDom
            ]
        });
    }

    enable(){
        this.background.addEventListener("dblclick", this.onDoubleClick);
        this.background.addEventListener("click", this.onClick);
        this.background.addEventListener("mousedown", this.onMouseDown);

        this.background.addEventListener("dragover", this.onDragOver);
        this.background.addEventListener("dragleave", this.onDragLeave);
        this.background.addEventListener("drop", this.onDrop);

        this.background.addEventListener("contextmenu", e => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }

    onDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
        this.background.style.backgroundColor = "#cccccc";
    }

    onDragLeave = e => {
        this.background.style.backgroundColor = "white";
    }

    onDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        const items = e.dataTransfer.items;
        const nFiles = items.length;
        for(let i = 0; i < nFiles; i++){
            const reader = new FileReader();
            reader.onload = loadEvent => {
                const img = new Image();
                img.addEventListener("load", () => {
                    const box = this.context.boxes.createBox(
                        e.pageX - this.x,
                        e.pageY - this.y,
                        `<img class="importedImage" src="${loadEvent.target.result}">`
                    );
                    this.context.boxes.addBox(box);
                    Object.assign(box.content.dom.style, {
                        width:img.naturalWidth,
                        height:img.naturalHeight,
                    });
                });
                img.src = loadEvent.target.result;
            };
            reader.readAsDataURL(items[i].getAsFile());
        }
        this.background.style.backgroundColor = "white";
    }

    onDoubleClick = e => {
        this.context.boxes.startBoxCreation(e.pageX - this.x, e.pageY - this.y);
    }

    onClick = e => {
        if(!this.hasSelected && !this.hasPanned){
            this.context.selection.clear();
        }
    }

    onMouseDown = e => {
        e.preventDefault();
        if(e.button === 2){
            this.onStartPan(e);
        }
        else{
            this.onStartSelect(e);
        }
    }

    onStartPan = e => {
        this.initialDragMouse = {
            x:e.pageX,
            y:e.pageY,
        };
        this.initialDragPos = {
            x:this.x,
            y:this.y,
        };
        this.hasPanned = false;
        document.body.addEventListener("mousemove", this.onPan);
        document.body.addEventListener("mouseup", this.onStopPan);
    }

    onStopPan = e => {
        document.body.removeEventListener("mousemove", this.onPan);
        document.body.removeEventListener("mouseup", this.onStopPan);
        this.hasPanned = Boolean(this.velocity);
        if(this.velocity){
            this.onInertia();
        }
    }

    onPan = e => {
        this.hasPanned = true;
        const delta = {
            x:e.pageX - this.initialDragMouse.x,
            y:e.pageY - this.initialDragMouse.y,
        };
        this.velocity = {
            x:this.initialDragPos.x + delta.x - this.x,
            y:this.initialDragPos.y + delta.y - this.y,
        };
        this.setPosition(
            this.initialDragPos.x + delta.x,
            this.initialDragPos.y + delta.y,
        );
    }

    onStartSelect = e => {
        this.initialDragMouse = {
            x:e.pageX,
            y:e.pageY,
        };
        if(!e.shiftKey){
            this.context.selection.clear();
        }
        this.initialBoxesSelection = this.context.selection.boxes.concat();
        document.body.addEventListener("mousemove", this.onSelect);
        document.body.addEventListener("mouseup", this.onStopSelect);
        this.dom.appendChild(this.selectionRect);
        Object.assign(this.selectionRect.style, {
            top:this.initialDragMouse.y + "px",
            left:this.initialDragMouse.x + "px",
            width:"0px",
            height:"0px",
        });
        this.hasSelected = false;
    }

    onStopSelect = e => {
        document.body.removeEventListener("mousemove", this.onSelect);
        document.body.removeEventListener("mouseup", this.onStopSelect);
        this.dom.removeChild(this.selectionRect);
        this.hasSelected = this.initialBoxesSelection.length !== this.context.selection.boxes.length;
    }

    onSelect = e => {
        const selectionRect = {
            x:Math.min(e.pageX, this.initialDragMouse.x) - this.x,
            y:Math.min(e.pageY, this.initialDragMouse.y) - this.y,
            width:Math.abs(e.pageX - this.initialDragMouse.x),
            height:Math.abs(e.pageY - this.initialDragMouse.y),
        };
        Object.assign(this.selectionRect.style, {
            left:(selectionRect.x + this.x) + "px",
            top:(selectionRect.y + this.y) + "px",
            width:selectionRect.width + "px",
            height:selectionRect.height + "px",
        });
        const boxes = this.context.boxes.boxes.filter(box => {
            const inter = boxesIntersection(box.getRect(), selectionRect);
            return inter.width > 0 && inter.height > 0;
        });
        this.context.selection.setBoxes(Array.from(new Set([...boxes, ...this.initialBoxesSelection])));
        this.hasSelected = true;
    }

    onInertia = () => {
        if(!this.velocity)return;
        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
        this.setPosition(
            this.x + this.velocity.x,
            this.y + this.velocity.y,
        );
        if(Math.hypot(this.velocity.x, this.velocity.y) > MIN_SPEED){
            this.inertiaRaf = requestAnimationFrame(this.onInertia);
        }
        else{
            this.velocity = undefined;
        }
    }


    setPosition(x, y){
        this.x = x;
        this.y = y;
        this.pannableDom.style.left = this.x + "px";
        this.pannableDom.style.top = this.y + "px";
        this.context.links.setPosition(this.x, this.y);
    }

    updateSize(){
        this.width = this.dom.clientWidth;
        this.height = this.dom.clientHeight;
    }
}
