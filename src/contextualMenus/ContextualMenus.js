import {dom} from "../utils/dom";
import AlignmentMenu from "./AlignmentMenu";
import LinkMenu from "./LinkMenu";
import BoxMenu from "../contextualMenus/BoxMenu";

export default class ContextualMenus{
    constructor(context){
        this.context = context;
        this.currentMenu = undefined;
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
        let menu;
        if(links.length === 0 && boxes.length === 1){
            this.boxMenu.setBox(boxes[0]);
            menu = this.boxMenu;
        }
        else if(links.length === 0 && boxes.length > 1){
            menu = this.alignmentMenu;
        }
        else if(links.length === 1 && boxes.length === 0){
            this.linkMenu.setLink(links[0]);
            menu = this.linkMenu;
        }
        else{
            menu = undefined;
        }

        if(this.currentMenu !== menu){
            if(this.currentMenu){
                this.currentMenu.close();
            }
            if(menu){
                menu.open();
            }
        }
        this.currentMenu = menu;
        if(this.currentMenu){
            this.currentMenu.update();
        }
    }
}
