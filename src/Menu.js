import {dom} from "./utils/dom";
import {saveIcon, addFileIcon} from "./utils/icons";
export default class Menu{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.centerButton = dom({
            type:"button",
            classes:"menu-button menu-center",
            innerHTML:"center",
        });
        this.saveButton = dom({
            type:"button",
            classes:"menu-button",
            children:[saveIcon()],
        });
        this.label = dom({
            type:"label",
            classes:"menu-button",
            attributes:{for:"openFile"},
            children:[addFileIcon()]
        });
        this.fileInput = dom({
            type:"input",
            classes:"menu-open",
            attributes:{
                id:"openFile",
                type:"file"
            }
        });
        this.dom = dom({
            classes:"menu",
            children:[
                this.centerButton,
                this.saveButton,
                this.label,
                this.fileInput,
            ]
        });
    }

    enable(){
        this.centerButton.addEventListener("click", this.onCenterClick);
        this.saveButton.addEventListener("click", this.onSaveClick);
        this.fileInput.addEventListener('change', this.onFileSelected, false);
    }

    disable(){
        this.centerButton.removeEventListener("click", this.onCenterClick);
        this.saveButton.removeEventListener("click", this.onSaveClick);
        this.fileInput.removeEventListener('change', this.onFileSelected);
    }

	onCenterClick = () => {
		this.context.stage.center();
	}

    onSaveClick = () => {
        const memento = this.context.getMemento();
		const titleElement = this.context.dom.querySelector("h1.title");
		const title = titleElement ? titleElement.innerHTML : "diagram";
        downloadFile(JSON.stringify(memento), title);
    }

    onFileSelected = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = evt => {
                const memento = JSON.parse(evt.target.result);
                return this.context.setMemento(memento);
            };
            reader.onerror = function (evt) {
                console.error("error reading file");
            };
        }

    }
}



function downloadFile(json, exportName){
    const dataStr = "data:text;charset=utf-8," + encodeURIComponent(json);
    const downloadAnchorNode = dom({type:'a', attributes:{href:dataStr, download:exportName + ".json"}});
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
