import {dom} from "../utils/dom";
import ArrowMenu from "./ArrowMenu";

export default class LinkMenu{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.originMenu = new ArrowMenu(this.context, type => this.context.links.lastOriginType = type);
        this.targetMenu = new ArrowMenu(this.context, type => this.context.links.lastTargetType = type);
        this.deleteButton = dom({type:"button", classes:"linkMenu-delete", innerHTML:"X"});
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
        Object.assign(this.deleteButton.style, {
            top:(this.link.headOrigin.y + this.link.headTarget.y)/2 + "px",
            left:(this.link.headOrigin.x + this.link.headTarget.x)/2 + "px",
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
