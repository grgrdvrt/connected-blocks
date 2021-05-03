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
        this.dom = dom({
            classes:"linkMenu",
            children:[
                this.originMenu.dom,
                this.targetMenu.dom,
            ]
        });
    }

    open(link){
        this.dom.classList.add("opened");
        this.link = link;
        this.originMenu.setLinkHead(this.link.headOrigin);
        this.targetMenu.setLinkHead(this.link.headTarget);
        this.originMenu.enable();
        this.targetMenu.enable();
    }

    close(){
        this.dom.classList.remove("opened");
        this.originMenu.disable();
        this.targetMenu.disable();
    }
}
