import {dom} from "../utils/dom";
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
        this.deleteButton = dom({type:"button", classes:"linkMenu-delete", children:[deleteIcon()]});
        this.dom = dom({
            classes:"linkMenu",
            children:[
                this.originMenu.dom,
                this.targetMenu.dom,
                this.deleteButton,
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
        Object.assign(this.deleteButton.style, {
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
        this.originMenu.enable();
        this.targetMenu.enable();
        this.deleteButton.addEventListener("click", this.onDeleteClicked);
    }

    close(){
        this.dom.classList.remove("opened");
        this.originMenu.disable();
        this.targetMenu.disable();
        this.deleteButton.removeEventListener("click", this.onDeleteClicked);
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
}
