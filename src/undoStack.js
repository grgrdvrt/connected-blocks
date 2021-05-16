export default class UndoStack{
    constructor(context){
        this.context = context;
        this.actions = [];
        this.id = 0;
    }

    enable(){
        this.context.dom.addEventListener("keyup", this.onKeyUp);
    }

    disable(){
        this.context.dom.removeEventListener("keyup", this.onKeyUp);
    }

    onKeyUp = e => {
        if(e.ctrlKey){
            switch(e.key){
                case "z":
                    this.undo();
                    break;
                case "y":
                case "Z":
                    this.redo();
                    break;
            }
        }
    }

    canUndo(){
        return this.id > 0;
    }

    canRedo(){
        return this.id < this.actions.length;
    }

    undo(){
        if(this.canUndo()){
            this.actions[this.id - 1].undo();
            this.id--;
        }
    }

    redo(){
        if(this.canRedo()){
            this.actions[this.id].redo();
            this.id++;
        }
    }

    addAction(action){
        this.actions.length = this.id;
        this.actions.push(action);
        this.id++;
    }
}
