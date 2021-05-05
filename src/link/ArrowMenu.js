import {headTypes} from "./LinkHead";
import {dom, svg} from "../utils/dom";

export default class ArrowMenu{
    constructor(context, setDefaultFunc){
        this.context = context;
        this.setDefaultFunc = setDefaultFunc;
        this.initDom();
    }

    initDom(){
        this.buttons = Object.values(headTypes).map((headType, i) => {
            const button = dom({
                type:"button",
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
            const type = Object.values(headTypes)[id];
            const prevType = this.linkHead.type;
            this.setDefaultFunc(type);
            const exec = () => {
                this.linkHead.setType(type);
                this.linkHead.link.update();
            };
            this.context.undoStack.addAction({
                description:"set link head type",
                undo:() => {
                    this.linkHead.setType(prevType);
                    this.linkHead.link.update();
                },
                redo:() => {
                    exec();
                },
            });
            exec();
        }
    }

    setLinkHead(linkHead){
        this.linkHead = linkHead;
        Object.assign(this.dom.style, {
            top:linkHead.y + "px",
            left:linkHead.x + "px",
            transform:`translate(-50%, -50%) rotate(${linkHead.rotation}deg) translate(-80%, -60%)`
        });
    }
}
