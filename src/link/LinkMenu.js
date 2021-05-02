import {dom} from "../utils/dom";
import ArrowMenu from "./ArrowMenu";

export default class LinkMenu{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.dom = dom({classes:"linkMenu"});
        this.originMenu = new ArrowMenu();
    }

    setLink(link){
        this.link = link;
    }
}
