import Stage from "./stage";
import Boxes from "./box/Boxes";
import BoxesActions from "./box/BoxesActions";
import Links from "./link/Links";
import LinksActions from "./link/LinksActions";
import Selection from "./selection";
import ContextualMenus from "./contextualMenus/ContextualMenus";
import Menu from "./Menu";
import UndoStack from "./undoStack";

class Main {
    constructor(){
        this.dom = document.body;
        this.stage = new Stage(this);
        this.stage.enable();
        this.dom.appendChild(this.stage.dom);

        this.undoStack = new UndoStack(this);
        this.undoStack.enable();

        this.boxesActions = new BoxesActions(this);
        this.linksActions = new LinksActions(this);

        this.links = new Links(this);
        this.stage.fixedDom.appendChild(this.links.dom);

        this.boxes = new Boxes(this);
        this.stage.pannableDom.appendChild(this.boxes.dom);

        this.contextualMenus = new ContextualMenus(this);
        this.stage.pannableDom.appendChild(this.contextualMenus.dom);

        this.menu = new Menu(this);
        this.menu.enable();
        this.dom.appendChild(this.menu.dom);

        this.selection = new Selection(this);

        window.addEventListener("resize", this.onResize);
        this.onResize();

        window.addEventListener("keydown", this.onKeydown);

        // this.initDebug();
    }

    initDebug(){
        this.setMemento(JSON.parse("{\"boxes\":[{\"x\":150,\"y\":150,\"content\":\"hello\"},{\"x\":450,\"y\":100,\"content\":\"<img src=\\\"https://grgrdvrt.com/works/delaunoids/home_thumb.jpg\\\">\\n\"},{\"x\":250,\"y\":400,\"content\":\"hello\"},{\"x\":650,\"y\":450,\"content\":\"world\"},{\"x\":896,\"y\":590,\"content\":\"<h5>Class</h5>\\n<hr>\\nmethod1()  \\nmethod2()  \\ntruc\"},{\"x\":704,\"y\":625,\"content\":\"a node\"},{\"x\":770,\"y\":788,\"content\":\"another node\"}],\"links\":[{\"origin\":{\"id\":0,\"type\":\"none\"},\"target\":{\"id\":1,\"type\":\"arrow\"}},{\"origin\":{\"id\":2,\"type\":\"none\"},\"target\":{\"id\":3,\"type\":\"arrow\"}},{\"origin\":{\"id\":4,\"type\":\"none\"},\"target\":{\"id\":1,\"type\":\"solidDiamond\"}},{\"origin\":{\"id\":5,\"type\":\"none\"},\"target\":{\"id\":1,\"type\":\"arrow\"}},{\"origin\":{\"id\":5,\"type\":\"none\"},\"target\":{\"id\":3,\"type\":\"arrow\"}},{\"origin\":{\"id\":6,\"type\":\"none\"},\"target\":{\"id\":4,\"type\":\"arrow\"}},{\"origin\":{\"id\":6,\"type\":\"none\"},\"target\":{\"id\":5,\"type\":\"arrow\"}},{\"origin\":{\"id\":6,\"type\":\"none\"},\"target\":{\"id\":2,\"type\":\"arrow\"}}]}"));

    }


    onResize = () => {
        this.stage.updateSize();
        this.links.setSize(this.stage.width, this.stage.height);
    }

    onKeydown = e => {
        if(e.ctrlKey){
            switch(e.key){
                case "c":
					if(!this.boxes.getIsEditing()){
						navigator.clipboard.writeText(JSON.stringify(this.selection.copy()));
					}
                    break;
                case "v":
					if(!this.boxes.getIsEditing()){
						this.paste();
					}
                    break;
            }
        }
    }

    addMemento(memento){
        const baseId = this.boxes.nextId;
        const clone = JSON.parse(JSON.stringify(memento));
        clone.boxes.forEach(box => {
            box.id += baseId;
        });
        clone.links.forEach(link => {
            link.origin.id += baseId;
            link.target.id += baseId;
        });
        const newBoxes = this.boxes.setMemento(clone.boxes);
        const newLinks = this.links.setMemento(clone.links);
        return {newBoxes, newLinks};
    }

    paste(){
		navigator.clipboard.readText().then(clipText => {
			const memento = JSON.parse(clipText);
			const {newBoxes, newLinks} = this.addMemento(memento);

			this.selection.setBoxes(newBoxes);
			newBoxes.forEach(box => {
				box.setPosition(box.x + 50, box.y + 50);
			});
			this.undoStack.addAction({
				undo:() => {
					newBoxes.forEach(box => {
						this.boxes.removeBox(box);
					});
					newLinks.forEach(link => {
						this.links.removeLink(link);
					});
				},
				redo:() => {
					newBoxes.forEach(box => {
						this.boxes.addBox(box);
					});
					newLinks.forEach(link => {
						this.links.addLink(link);
					});
				},
			});
		});
    }

	updateTitle(){
		const titleElement = this.dom.querySelector("h1.title");
		document.title = titleElement ? titleElement.innerHTML : "Diagram";
	}


    setMemento(memento){
        this.boxes.clear();
        this.links.clear();
        this.addMemento(memento);
    }

    getMemento(){
        return {
            boxes:this.boxes.getMemento(),
            links:this.links.getMemento(),
        };
    }
}

window.main = new Main();
