import {dom} from "./utils/dom";
import {
    leftAlignIcon,
    rightAlignIcon,
    topAlignIcon,
    bottomAlignIcon,
    verticalAlignIcon,
    horizontalAlignIcon,

    verticalDistributeIcon,
    horizontalDistributeIcon,
} from "./utils/icons";

export default class SelectionMenu{
    constructor(context){
        this.context = context;
        this.initDom();
        this.isHidden = true;
    }

    initDom(){
        const leftAlignBtn = dom({type:"button", children:[leftAlignIcon()]});
        const verticalAlignBtn = dom({type:"button", children:[verticalAlignIcon()]});
        const rightAlignBtn = dom({type:"button", children:[rightAlignIcon()]});
        const topContainer = dom({
            classes:"selectionMenu-top",
            children:[
                leftAlignBtn,
                verticalAlignBtn,
                rightAlignBtn,
            ]
        });
        const topAlignBtn = dom({type:"button", children:[topAlignIcon()]});
        const horizontalAlignBtn = dom({type:"button", children:[horizontalAlignIcon()]});
        const bottomAlignBtn = dom({type:"button", children:[bottomAlignIcon()]});
        const leftContainer = dom({
            classes:"selectionMenu-left",
            children:[
                topAlignBtn,
                horizontalAlignBtn,
                bottomAlignBtn,
            ]
        });

        const horizontalDistributeBtn = dom({
            type:"button",
            classes:"selectionMenu-horizontalDistributeBtn",
            children:[horizontalDistributeIcon()]
        });
        const verticalDistributeBtn = dom({
            type:"button",
            classes:"selectionMenu-verticalDistributeBtn",
            children:[verticalDistributeIcon()]
        });

        this.dom = dom({
            classes:"selectionMenu hidden",
            children:[
                topContainer,
                leftContainer,
                horizontalDistributeBtn,
                verticalDistributeBtn,
            ]
        });

        this.alignMap = new Map();
        this.alignMap.set(leftAlignBtn, {rect:[1, 0, 0, 0], box:[0, 1, 0, 0]});
        this.alignMap.set(verticalAlignBtn, {rect:[1, 0, 0.5, 0], box:[0, 1, -0.5, 0]});
        this.alignMap.set(rightAlignBtn, {rect:[1, 0, 1, 0], box:[0, 1, -1, 0]});

        this.alignMap.set(topAlignBtn, {rect:[0, 1, 0, 0], box:[1, 0, 0, 0]});
        this.alignMap.set(horizontalAlignBtn, {rect:[0, 1, 0, 0.5], box:[1, 0, 0, -0.5]});
        this.alignMap.set(bottomAlignBtn, {rect:[0, 1, 0, 1], box:[1, 0, 0, -1]});

        this.distributionMap = new Map();
        this.distributionMap.set(horizontalDistributeBtn, {x:1, y:0});
        this.distributionMap.set(verticalDistributeBtn, {x:0, y:1});
    }

    updateVisibility(){
        if(this.context.selection.boxes.length > 1){
            if(this.isHidden){
                this.show();
            }
            this.update();
            this.context.boxes.dom.classList.add("multipleSelection");
        }
        else if(!this.isHidden){
            this.hide();
            this.context.boxes.dom.classList.remove("multipleSelection");
        }
    }

    show(){
        this.isHidden = false;
        this.dom.addEventListener("click", this.onClick);
        this.dom.classList.remove("hidden");
        this.update();
    }

    hide(){
        this.isHidden = true;
        this.dom.removeEventListener("click", this.onClick);
        this.dom.classList.add("hidden");
    }

    onClick = e => {
        if(this.alignMap.has(e.target)){
            this.alignBoxes(this.alignMap.get(e.target));
        }
        else if(this.distributionMap.has(e.target)){
            this.distributeBoxes(this.distributionMap.get(e.target));
        }
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
        this.rect = {
            x:xMin,
            y:yMin,
            width:xMax - xMin,
            height:yMax - yMin
        };
        const margin = 15;
        Object.assign(this.dom.style, {
            top:this.rect.y - margin + "px",
            left:this.rect.x - margin + "px",
            width:this.rect.width + 2 * margin + "px",
            height:this.rect.height + 2 * margin + "px",
        });
    }

    alignBoxes(ratios){
        const boxes = this.context.selection.boxes.concat();
        const {x:rx, y:ry, width:rw, height:rh} = this.rect;
        const newPositions = boxes.map(box => {
            const {x:bx, y:by, width:bw, height:bh} = box.getRect();
            return {
                x:ratios.rect[0] * rx + ratios.rect[2] * rw + ratios.box[0] * bx + ratios.box[2] * bw,
                y:ratios.rect[1] * ry + ratios.rect[3] * rh + ratios.box[1] * by + ratios.box[3] * bh
            };
        });
        this.context.boxesActions.setBoxesPositions(boxes, newPositions);
    }

    distributeBoxes(ratios){
        const boxes = this.context.selection.boxes.concat().sort((a, b) => {
            return (a.x - b.x) * ratios.x + (a.y - b.y) * ratios.y;
        });
        const {x:rx, y:ry, width:rw, height:rh} = this.rect;
        const boxRects = boxes.map(box => box.getRect());
        const sum = boxRects.reduce((sum, rect) => {
            sum.width += rect.width;
            sum.height += rect.height;
            return sum;
        }, {width:0, height:0});
        const space = {
            x:(rw - sum.width) / (boxes.length - 1),
            y:(rh - sum.height) / (boxes.length - 1),
        };
        let x = rx;
        let y = ry;
        const newPositions = boxes.map((box, i) => {
            const rect = boxRects[i];
            const pos = {
                x:x * ratios.x + rect.x * ratios.y,
                y:y * ratios.y + rect.y * ratios.x,
            };
            x += (space.x + rect.width);
            y += (space.y + rect.height);
            return pos;
        });
        this.context.boxesActions.setBoxesPositions(boxes, newPositions);
    }
}
