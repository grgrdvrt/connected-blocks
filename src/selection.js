export default class Selection {
    constructor(context){
        this.context = context;
        this.boxes = [];
        this.links = [];
        this.isDragging = false;
    }

    addBox(box){
        this._addBox(box);
        this.context.selectionMenu.updateVisibility();
    }

    removeBox(box){
        this._removeBox(box);
        this.context.selectionMenu.updateVisibility();
    }

    setBoxes(boxes){
        this.boxes.concat().forEach(box => this._removeBox(box));
        this.boxes.length = 0;
        boxes.forEach(box => this._addBox(box));
        this.context.selectionMenu.updateVisibility();
    }

    _removeBox(box){
        box.deselect();
        const id = this.boxes.indexOf(box);
        if(id !== -1){
            this.boxes.splice(id, 1);
        }
    }

    _addBox(box){
        box.select();
        if(!this.boxes.includes(box)){
            this.boxes.push(box);
        }
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

    clearBoxes(){
        this.boxes.forEach(box => {
            box.deselect();
        });
        this.boxes.length = 0;
        this.context.selectionMenu.updateVisibility();
    }

    clearLinks(){
        this.links.forEach(link => {
            link.deselect();
        });
        this.links.length = 0;
        this.context.links.update();
    }

    clear(){
        this.clearBoxes();
        this.clearLinks();
    }

    startDrag(x, y){
        this.isDragging = false;
        this.dragInfos = this.context.boxesActions.startDragBoxes(this.boxes.concat(), {x, y});

        this.context.dom.addEventListener("mouseup", this.onStopDrag);
        this.context.dom.addEventListener("mousemove", this.onDrag);

    }

    onStopDrag = e => {
        this.context.dom.removeEventListener("mouseup", this.onStopDrag);
        this.context.dom.removeEventListener("mousemove", this.onDrag);
        this.context.boxesActions.stopDragBoxes(this.dragInfos, {x:e.pageX, y:e.pageY});
    }

    onDrag = e => {
        this.isDragging = true;
        this.context.boxesActions.dragBoxes(this.dragInfos, {x:e.pageX, y:e.pageY});
    }

    copy(){
        const links = Array.from((this.boxes.reduce((relatedLinks, box) => {
            const boxRelatedLinks = this.context.links.getRelatedLinks(box);
            boxRelatedLinks.forEach(link => {
                relatedLinks.add(link);
            });
            return relatedLinks;
        }, new Set()))).filter(link => {
            return this.boxes.includes(link.origin)
                && this.boxes.includes(link.target);
        });
        return {
            boxes:this.boxes.map(box => box.getMemento()),
            links:links.map(link => link.getMemento()),
        };

    }
}
