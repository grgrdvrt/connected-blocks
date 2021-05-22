import {dom} from "../utils/dom";
import {rectsBounding} from "../utils/maths";
import {
    leftAlignIcon,
    rightAlignIcon,
    topAlignIcon,
    bottomAlignIcon,
    verticalAlignIcon,
    horizontalAlignIcon,

    verticalDistributeIcon,
    horizontalDistributeIcon,
} from "../utils/icons";

export default class AligmentMenu{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        const leftAlignBtn = dom({type:"button", children:[leftAlignIcon()]});
        const verticalAlignBtn = dom({type:"button", children:[verticalAlignIcon()]});
        const rightAlignBtn = dom({type:"button", children:[rightAlignIcon()]});
        const topContainer = dom({
            classes:"alignmentMenu-top",
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
            classes:"alignmentMenu-left",
            children:[
                topAlignBtn,
                horizontalAlignBtn,
                bottomAlignBtn,
            ]
        });

        const horizontalDistributeBtn = dom({
            type:"button",
            classes:"alignmentMenu-horizontalDistributeBtn",
            children:[horizontalDistributeIcon()]
        });
        const verticalDistributeBtn = dom({
            type:"button",
            classes:"alignmentMenu-verticalDistributeBtn",
            children:[verticalDistributeIcon()]
        });

        this.dom = dom({
            classes:"alignmentMenu closed",
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

    open(){
        this.dom.addEventListener("click", this.onClick);
        this.dom.classList.remove("closed");
        this.update();
    }

    close(){
        this.dom.removeEventListener("click", this.onClick);
        this.dom.classList.add("closed");
    }

    onClick = e => {
        const boxes = this.context.selection.boxes.concat();
        if(this.alignMap.has(e.target)){
            this.alignBoxes(boxes, this.alignMap.get(e.target));
        }
        else if(this.distributionMap.has(e.target)){
            this.distributeBoxes(boxes, this.distributionMap.get(e.target));
        }
    }

    update(){
        this.rect = rectsBounding(
            this.context.selection.boxes.map(
                box => box.getRect()
            )
        );
        const margin = 15;
        Object.assign(this.dom.style, {
            top:this.rect.y - margin + "px",
            left:this.rect.x - margin + "px",
            width:this.rect.width + 2 * margin + "px",
            height:this.rect.height + 2 * margin + "px",
        });
    }

    alignBoxes(boxes, ratios){
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

    distributeBoxes(boxes, ratios){
        boxes.sort((a, b) => {
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

    autoLayout(){
        const boxes = this.context.selection.boxes.concat();
        const rects = new Map(boxes.map(box => [box, box.getRect()]));
        const areas = new Map(boxes.map(box => {
            const rect = rects.get(box);
            return [box, {
                xMin:rect.x,
                yMin:rect.y,
                xMax:rect.x + rect.width,
                yMax:rect.y + rect.height,
            }];
        }));
        boxes.forEach(boxA => {
            const a = areas.get(boxA);
            boxes.forEach(boxB => {
                const b = areas.get(boxB);
                if((a.xMin >= b.xMin && a.xMin <= b.xMax)
                   || (b.xMin >= a.xMin && b.xMin <= a.xMax)) {
                    a.xMin = b.xMin = Math.min(a.xMin, b.xMin);
                    a.xMax = b.xMax = Math.max(a.xMax, b.xMax);
                }
                if((a.yMin >= b.yMin && a.yMin <= b.yMax)
                   || (b.yMin >= a.yMin && b.yMin <= a.yMax)) {
                    a.yMin = b.yMin = Math.min(a.yMin, b.yMin);
                    a.yMax = b.yMax = Math.max(a.yMax, b.yMax);
                }
            });
        });
        const newPositions = boxes.map(box => {
            const rect = rects.get(box);
            const area = areas.get(box);
            return {
                x:0.5 * (area.xMin + area.xMax) - 0.5 * rect.width,
                y:0.5 * (area.yMin + area.yMax) - 0.5 * rect.height,
            };
        });
        this.context.boxesActions.setBoxesPositions(boxes, newPositions);
    }
}
