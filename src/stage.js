import {dom} from "./utils/dom";

const FRICTION = 0.9;
const MIN_SPEED = 0.5;
export default class Stage{
    constructor(context){
        this.context = context;
        this.initDom();

        this.x = 0;
        this.y = 0;
    }

    initDom(){
        this.background = dom({classes:"stage-background"});
        this.dom = dom({
            classes:"stage",
            children:[
                this.background,
            ]
        });
    }

    enable(){
        this.background.addEventListener("dblclick", this.onDoubleClick);
        this.background.addEventListener("click", this.onClick);
        this.background.addEventListener("mousedown", this.onStartDrag);
    }

    onDoubleClick = e => {
        this.context.boxes.startBoxCreation(e.pageX - this.x, e.pageY - this.y);
    }

    onClick = e => {
        this.context.selection.clear();
    }

    onStartDrag = e => {
        this.initialDragMouse = {
            x:e.pageX,
            y:e.pageY,
        };
        this.initialDragPos = {
            x:this.x,
            y:this.y,
        };
        document.body.addEventListener("mousemove", this.onDrag);
        document.body.addEventListener("mouseup", this.onStopDrag);
    }

    onStopDrag = e => {
        document.body.removeEventListener("mousemove", this.onDrag);
        document.body.removeEventListener("mouseup", this.onStopDrag);
        if(this.velocity){
            this.onInertia();
        }
    }

    onDrag = e => {
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

    onInertia = () => {
        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
        this.setPosition(
            this.x + this.velocity.x,
            this.y + this.velocity.y,
        );
        if(Math.hypot(this.velocity.x, this.velocity.y) > MIN_SPEED){
            this.inertiaRaf = requestAnimationFrame(this.onInertia);
        }
    }


    setPosition(x, y){
        this.x = x;
        this.y = y;
        this.context.boxes.dom.style.left = this.x + "px";
        this.context.boxes.dom.style.top = this.y + "px";
        this.context.linkMenu.dom.style.left = this.x + "px";
        this.context.linkMenu.dom.style.top = this.y + "px";
        this.context.links.setPosition(this.x, this.y);
    }

    updateSize(){
        this.width = this.dom.clientWidth;
        this.height = this.dom.clientHeight;
    }
}
