export default class Selection {
    constructor(context){
        this.context = context;
        this.boxes = [];
        this.links = [];
        this.isDragging = false;
    }

    addBox(box){
        box.select();
        if(!this.boxes.includes(box)){
            this.boxes.push(box);
        }
    }

    removeBox(box){
        box.deselect();
        const id = this.boxes.indexOf(box);
        if(id !== -1){
            this.boxes.splice(id, 1);
        }
    }

    setBoxes(boxes){
        this.boxes.concat().forEach(box => this.removeBox(box));
        this.boxes.length = 0;
        boxes.forEach(box => this.addBox(box));
    }

    addLink(link){
        link.select();
        if(!this.links.includes(link)){
            this.links.push(link);
        }
    }

    removeLink(link){
        link.deselect();
        const id = this.links.indexOf(link);
        if(id !== -1){
            this.links.splice(id, 1);
        }
    }

    setLinks(links){
        this.links.concat().forEach(link => this.removeLink(link));
        this.links.length = 0;
        links.forEach(link => this.addLink(link));
    }

    clear(){
        this.boxes.forEach(box => {
            box.deselect();
        });
        this.boxes.length = 0;
        this.links.forEach(link => {
            link.deselect();
        });
        this.links.length = 0;
        this.context.links.update();
    }

    startDrag(x, y){
        this.initialDragPosition = {x, y};
        this.isDragging = false;

        this.context.dom.addEventListener("mouseup", this.onStopDrag);
        this.context.dom.addEventListener("mousemove", this.onDrag);
        this.initialBoxesPositions = this.boxes.map(box => {
            return {x:box.x, y:box.y};
        });
    }

    onStopDrag = e => {
        this.context.dom.removeEventListener("mouseup", this.onStopDrag);
        this.context.dom.removeEventListener("mousemove", this.onDrag);

        const delta = {
            x:e.pageX - this.initialDragPosition.x,
            y:e.pageY - this.initialDragPosition.y,
        };
        const movedBoxes = this.boxes.concat();
        this.context.undoStack.addAction({
            description:"move boxes",
            undo:() => {
                movedBoxes.forEach(box => {
                    box.setPosition(
                        box.x - delta.x,
                        box.y - delta.y,
                    );
                });
                this.context.links.update();
            },
            redo:() => {
                movedBoxes.forEach(box => {
                    box.setPosition(
                        box.x + delta.x,
                        box.y + delta.y,
                    );
                });
                this.context.links.update();
            }
        });
    }

    onDrag = e => {
        this.isDragging = true;
        const delta = {
            x:e.pageX - this.initialDragPosition.x,
            y:e.pageY - this.initialDragPosition.y,
        };
        this.boxes.forEach((box, i) => {
            const initPos = this.initialBoxesPositions[i];
            box.setPosition(
                initPos.x + delta.x,
                initPos.y + delta.y,
            );
            box.isDragging = true;
        });

        (new Set(this.boxes.map(box => this.context.links.getRelatedLinks(box)).flat()))
            .forEach(link => link.update());
    }
}
