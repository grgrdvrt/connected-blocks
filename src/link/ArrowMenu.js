import {headTypes} from "./LinkHead";
import {dom, svg} from "../utils/dom";

export default class ArrowMenu{
    constructor(){
        this.initDom();
    }

    initDom(){
        this.buttons = Object.values(headTypes).map((headType, i) => {
            const button = dom({
                type:"button",
                classes:"arrowMenu-button",
                attributes:{
                    "data-id":i
                },
                children:[
                    svg("svg", {
                        attributes:{
                            width:"20px",
                            height:"20px",
                        },
                        children:[
                            svg("path", {
                                attributes:{
                                    transform:"translate(18, 10)",
                                    d:headType.d,
                                    stroke:"#777777",
                                    "stroke-width":"2",
                                    fill:headType.fill
                                }
                            })
                        ]
                    })
                ]
            });
            return button;
        });
        this.dom = dom({
            classes:"arrowMenu",
            children:this.buttons
        });
    }

    enable(){
        this.dom.addEventListener("click", this.onClick);
    }

    disable(){
        this.dom.removeEventListener("click", this.onClick);
    }

    onClick = e => {
        const id = e.target.dataset.id;
        if(id !== undefined){
            this.linkHead.setType(Object.values(headTypes)[id]);
            this.linkHead.link.update();
        }
    }

    setLinkHead(linkHead){
        this.linkHead = linkHead;
        Object.assign(this.dom.style, {
            top:linkHead.y + "px",
            left:linkHead.x + "px",
        });
    }
}
