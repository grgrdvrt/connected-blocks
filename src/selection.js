export default class Selection {
    constructor(context){
        this.context = context;
        this.boxes = [];
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

    clear(){
        this.boxes.forEach(box => {
            box.deselect();
        });
        this.boxes.length = 0;
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

        this.context.updateLinks();
    }
}
