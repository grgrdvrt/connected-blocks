import {dom} from "./utils/dom";

export default class SelectionMenu{
    constructor(context){
        this.context = context;
        this.initDom();
        this.isHidden = true;
    }

    initDom(){
        const leftAlignBtn = dom({type:"button", innerHTML:"<"});
        const verticalAlignBtn = dom({type:"button", innerHTML:"|"});
        const rightAlignBtn = dom({type:"button", innerHTML:">"});
        this.topContainer = dom({
            classes:"selectionMenu-top",
            children:[
                leftAlignBtn,
                verticalAlignBtn,
                rightAlignBtn,
            ]
        });
        const topAlignBtn = dom({type:"button", innerHTML:"^"});
        const horizontalAlignBtn = dom({type:"button", innerHTML:"-"});
        const bottomAlignBtn = dom({type:"button", innerHTML:"v"});
        this.leftContainer = dom({
            classes:"selectionMenu-left",
            children:[
                topAlignBtn,
                horizontalAlignBtn,
                bottomAlignBtn,
            ]
        });
        this.dom = dom({
            classes:"selectionMenu hidden",
            children:[
                this.topContainer,
                this.leftContainer,
            ]
        });

        this.alignMap = new Map();
        this.alignMap.set(leftAlignBtn, {rect:[1, 0, 0, 0], box:[0, 1, 0, 0]});
        this.alignMap.set(verticalAlignBtn, {rect:[1, 0, 0.5, 0], box:[0, 1, -0.5, 0]});
        this.alignMap.set(rightAlignBtn, {rect:[1, 0, 1, 0], box:[0, 1, -1, 0]});

        this.alignMap.set(topAlignBtn, {rect:[0, 1, 0, 0], box:[1, 0, 0, 0]});
        this.alignMap.set(horizontalAlignBtn, {rect:[0, 1, 0, 0.5], box:[1, 0, 0, -0.5]});
        this.alignMap.set(bottomAlignBtn, {rect:[0, 1, 0, 1], box:[1, 0, 0, -1]});
    }

    updateVisibility(){
        if(this.context.selection.boxes.length > 1){
            if(this.isHidden){
                this.show();
            }
            this.update();
        }
        else if(!this.isHidden){
            this.hide();
        }
    }

    show(){
        this.isHidden = false;
        this.topContainer.addEventListener("click", this.onClick);
        this.leftContainer.addEventListener("click", this.onClick);
        this.dom.classList.remove("hidden");
        this.update();
    }

    hide(){
        this.isHidden = true;
        this.topContainer.removeEventListener("click", this.onClick);
        this.leftContainer.removeEventListener("click", this.onClick);
        this.dom.classList.add("hidden");
    }

    onClick = e => {
        this.alignBoxes(this.alignMap.get(e.target));
    }

    update(){
        const selection = this.context.selection.boxes;
        let xMin = Number.POSITIVE_INFINITY;
        let yMin = Number.POSITIVE_INFINITY;
        let xMax = Number.NEGATIVE_INFINITY;
        let yMax = Number.NEGATIVE_INFINITY;
        selection.forEach(box => {
            const boxRect = box.getRect();
            if(boxRect.x < xMin) xMin = boxRect.x;
            if(boxRect.y < yMin) yMin = boxRect.y;
            if(boxRect.x + boxRect.width > xMax) xMax = boxRect.x + boxRect.width;
            if(boxRect.y + boxRect.height > yMax) yMax = boxRect.y + boxRect.height;
        });
        this.rect = {x:xMin, y:yMin, width:xMax - xMin, height:yMax - yMin};
        Object.assign(this.dom.style, {
            top:this.rect.y + "px",
            left:this.rect.x + "px",
            width:this.rect.width + "px",
            height:this.rect.height + "px",
        });
    }

    alignBoxes(ratios){
        const boxes = this.context.selection.boxes;
        const {x:rx, y:ry, width:rw, height:rh} = this.rect;
        boxes.forEach(box => {
            const {x:bx, y:by, width:bw, height:bh} = box.getRect();
            box.setPosition(
                ratios.rect[0] * rx + ratios.rect[2] * rw + ratios.box[0] * bx + ratios.box[2] * bw,
                ratios.rect[1] * ry + ratios.rect[3] * rh + ratios.box[1] * by + ratios.box[3] * bh
            );
        });
        // this.update();
        this.context.links.update();
    }
}