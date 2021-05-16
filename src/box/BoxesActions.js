export default class BoxesActions{
    constructor(context){
        this.context = context;
    }

    startBoxCreation(x, y){
        const box = this.context.boxes.createBox(x, y);
        this.context.selection.setBoxes([box]);

        const exec = () => this.context.boxes.addBox(box);
        this.context.undoStack.addAction({
            description:"create box",
            undo:() => {
                this.context.boxes.removeBox(box);
            },
            redo:() => {
                exec();
            },
        });
        exec();

        box.content.enableEdition();
    }

    deleteBox(box){
        const links = this.context.links.getRelatedLinks(box);
        const exec = () => {
            this.context.boxes.removeBox(box);
            links.forEach(link => this.context.links.removeLink(link));
        };
        this.context.undoStack.addAction({
            description:"delete box",
            undo:() => {
                this.context.boxes.addBox(box);
                links.forEach(link => this.context.links.addLink(link));
            },
            redo:() => {
                exec();
            }
        });
        exec();
    }

    resizeBox(box, width, height){
        const {width:oldWidth, height:oldHeight} = box.initialContentSize;
        if((width || height) && (width !== oldWidth || height !== oldWidth)){
            this.context.undoStack.addAction({
                description:"resize box",
                undo:() => {
                    Object.assign(box.content.dom.style, {
                        width:oldWidth,
                        height:oldHeight,
                    });
                    box.updateRelatedLinks();
                },
                redo:() => {
                    Object.assign(box.content.dom.style, {
                        width:width,
                        height:height,
                    });
                    box.updateRelatedLinks();
                }
            });
        }
    }

    changeBoxColor(box, newColor){
        const oldColor = box.color;
        const exec = () => box.setColor(newColor);
        this.context.undoStack.addAction({
            description:"change box color",
            undo:() => box.setColor(oldColor),
            redo:() => exec()
        });
        exec();
    }

    editBoxContent(boxContent, newContent){
        const oldContent = boxContent.value;
        if(newContent !== oldContent){
            const exec = () => boxContent.setValue(newContent);
            this.context.undoStack.addAction({
                description:"edit box",
                undo:() => {
                    boxContent.setValue(oldContent);
                },
                redo:() => {
                    exec();
                }
            });
            exec();
        }
    }

    setBoxesPositions(boxes, newPositions){
        const oldPositions = boxes.map(box => {
            const {x, y} = box.getRect();
            return {x, y};
        });
        const setPositions = positions => {
            boxes.forEach((box, i) => {
                const pos = positions[i];
                box.setPosition(pos.x, pos.y);
            });
            this.context.links.update();
        };
        this.context.undoStack.addAction({
            undo:() => {
                setPositions(oldPositions);
            },
            redo:() => {
                setPositions(newPositions);
            }
        });
        setPositions(newPositions);
    }

    startDragBoxes(boxes, initialPointerPosition){
        return {
            boxes,
            initialPointerPosition,
            initialBoxesPositions:new Map(boxes.map(box => [box, {x:box.x, y:box.y}])),
            relatedLinks:new Set(boxes.map(box => this.context.links.getRelatedLinks(box)).flat()),
        };
    }

    dragBoxes(dragInfos, pointerPosition){
        dragInfos.boxes.forEach(box => {
            const initPos = dragInfos.initialBoxesPositions.get(box);
            box.setPosition(
                initPos.x + pointerPosition.x - dragInfos.initialPointerPosition.x,
                initPos.y + pointerPosition.y - dragInfos.initialPointerPosition.y,
            );
            box.isDragging = true;
        });

        this.context.selectionMenu.update();
        dragInfos.relatedLinks.forEach(link => link.update());
    }

    stopDragBoxes(dragInfos, pointerPosition){
        this.context.undoStack.addAction({
            description:"boxes dragged",
            undo:() => this.dragBoxes(dragInfos, dragInfos.initialPointerPosition),
            redo:() => this.dragBoxes(dragInfos, pointerPosition)
        });
    }
}
