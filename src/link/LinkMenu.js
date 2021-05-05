import {dom, svg} from "../utils/dom";
import ArrowMenu from "./ArrowMenu";
import {cubic, lerp} from "../utils/maths";
import {deleteIcon} from "../utils/icons";

export default class LinkMenu{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.originMenu = new ArrowMenu(this.context, type => this.context.links.lastOriginType = type);
        this.targetMenu = new ArrowMenu(this.context, type => this.context.links.lastTargetType = type);
        this.dashIcon = svg("line", {
            attributes:{
                stroke:"#555555",
                "stroke-width":"2",
                x1:"0%", y1:"50%", x2:"100%", y2:"50%",
            }
        });
        this.dashButton = dom({type:"button", children:[svg("svg", {
            attributes:{
                width:"15px",
                height:"15px",
                viewbox:"0 0 24 24"
            },
            children:[this.dashIcon]
        })]});
        this.deleteButton = dom({type:"button", children:[deleteIcon()]});
        this.centerMenu = dom({
            classes:["linkMenu-centerMenu"],
            children:[
                this.deleteButton,
                this.dashButton,
            ]
        });
        this.dom = dom({
            classes:"linkMenu",
            children:[
                this.originMenu.dom,
                this.targetMenu.dom,
                this.centerMenu,
            ]
        });
    }

    open(link){
        this.dom.classList.add("opened");
        this.link = link;
        this.originMenu.setLinkHead(this.link.headOrigin);
        this.targetMenu.setLinkHead(this.link.headTarget);
        const {x:ox, y:oy, normal:on} = this.link.headOrigin;
        const {x:tx, y:ty, normal:tn} = this.link.headTarget;
        Object.assign(this.centerMenu.style, {
            left:cubic(
                ox,
                lerp(ox, tx, 0.3 * Math.abs(on.x)),
                lerp(tx, ox, 0.3 * Math.abs(tn.x)),
                tx,
                0.5
            ) + "px",
            top:cubic(
                oy,
                lerp(oy, ty, 0.3 * Math.abs(on.y)),
                lerp(ty, oy, 0.3 * Math.abs(tn.y)),
                ty,
                0.5
            ) + "px",
        });
        this.updateDashButton();
        this.originMenu.enable();
        this.targetMenu.enable();
        this.deleteButton.addEventListener("click", this.onDeleteClicked);
        this.dashButton.addEventListener("click", this.onDashClicked);
    }

    updateDashButton(){
        if(this.link){
            this.dashIcon.setAttributeNS(null, "stroke-dasharray", this.link.isDashed ? "" : "3");
        }
    }

    close(){
        this.dom.classList.remove("opened");
        this.originMenu.disable();
        this.targetMenu.disable();
        this.deleteButton.removeEventListener("click", this.onDeleteClicked);
        this.dashButton.removeEventListener("click", this.onDashClicked);
    }

    onDeleteClicked = () => {
        const link = this.link;
        const exec = () => {
            this.context.links.removeLink(link);
        };
        this.context.undoStack.addAction({
            undo:() => {
                this.context.links.addLink(link);
            },
            redo:() => {
                exec();
            }
        });
        exec();
        this.context.selection.removeLink(link);
    }

    onDashClicked = () => {
        const link = this.link;
        const oldDash = this.link.isDashed;
        const exec = () => {
            link.setDashed(!oldDash);
        };
        this.context.undoStack.addAction({
            undo:() => {
                link.setDashed(oldDash);
            },
            redo:() => {
                exec();
            }
        });
        exec();
        this.context.links.lastDash = !oldDash;
    }
}
