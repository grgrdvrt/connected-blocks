import {dom} from "./utils/dom";
import {saveIcon, addFileIcon} from "./utils/icons";
export default class ExportMenu{
    constructor(context){
        this.context = context;
        this.initDom();
    }

    initDom(){
        this.saveButton = dom({
            type:"button",
            classes:"exportMenu-button",
            children:[saveIcon()],
        });
        this.label = dom({
            type:"label",
            classes:"exportMenu-button",
            attributes:{for:"openFile"},
            children:[addFileIcon()]
        });
        this.fileInput = dom({
            type:"input",
            classes:"exportMenu-open",
            attributes:{
                id:"openFile",
                type:"file"
            }
        });
        this.dom = dom({
            classes:"exportMenu",
            children:[
                this.saveButton,
                this.label,
                this.fileInput,
            ]
        });
    }

    enable(){
        this.saveButton.addEventListener("click", this.onSaveClick);
        this.fileInput.addEventListener('change', this.onFileSelected, false);
    }

    disable(){
        this.saveButton.removeEventListener("click", this.onSaveClick);
        this.fileInput.removeEventListener('change', this.onFileSelected);
    }

    onSaveClick = () => {
        const memento = this.context.getMemento();
        downloadFile(JSON.stringify(memento), "diagram");
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
