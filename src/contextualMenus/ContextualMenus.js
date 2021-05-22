import {dom} from "../utils/dom";
import {arraysDiff} from "../utils";
import AlignmentMenu from "./AlignmentMenu";
import LinkMenu from "./LinkMenu";
import BoxMenu from "../contextualMenus/BoxMenu";

export default class ContextualMenus{
    constructor(context){
        this.context = context;
        this.currentMenus = [];
        this.initDom();
    }

    initDom(){

        this.linkMenu = new LinkMenu(this.context);
        this.alignmentMenu = new AlignmentMenu(this.context);
        this.boxMenu = new BoxMenu(this.context);

        this.dom = dom({children:[
            this.linkMenu.dom,
            this.alignmentMenu.dom,
            this.boxMenu.dom
        ]});
    }

    update(){
        const {boxes, links} = this.context.selection;
        let menus = [];
        if(links.length === 0 && boxes.length > 0){
            this.boxMenu.setBoxes(boxes);
            menus.push(this.boxMenu);
        }
        if(links.length === 0 && boxes.length > 1){
            menus.push(this.alignmentMenu);
        }
        if(links.length === 1 && boxes.length === 0){
            this.linkMenu.setLink(links[0]);
            menus.push(this.linkMenu);
        }
        const {added, removed} = arraysDiff(menus, this.currentMenus);
        added.forEach(menu => menu.open());
        removed.forEach(menu => menu.close());
        this.currentMenus = menus;
        this.currentMenus.forEach(menu => menu.update());
    }
}
