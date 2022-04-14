import {
    dom,
    placeCaretAtEnd,
} from "../utils/dom";

import hljs from "highlight.js";
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage("javascript", javascript);

export default class BoxContent{
    constructor(context, box){
        this.context = context;
        this.isEditing = false;
        this.value = "";
        this.box = box;
        this.initDom();
    }

    initDom(){
        this.display = dom({
            type:"div",
            classes:"box-content-display",
        });
        this.input = dom({
            type:"div",
            attributes:{
                role:"textbox",
                contenteditable:true,
            },
            classes:"box-content-input",
        });
        this.dom = dom({
            classes:"box-content",
            children:[
                this.display,
                this.input,
            ]
        });
    }

    enable(){
        this.dom.addEventListener("dblclick", this.onEdit);
    }

    disable(){
        this.dom.removeEventListener("dblclick", this.onEdit);
    }

    onEdit = e => {
        e.preventDefault();
        this.enableEdition();
    }

    setValue(value){
        this.value = value;
        this.displayContent();
    }

    enableEdition(){
        if(this.isEditing){
            return;
        }
        this.isEditing = true;
        this.dom.classList.add("edition");
        this.context.selection.addBox(this.box);
        this.box.disableSelection();
        this.displayInput();
        placeCaretAtEnd(this.input);
        this.input.addEventListener("keyup", this.onEditionKeyUp);
    }

    disableEdition(){
        if(!this.isEditing){
            return;
        }
        this.isEditing = false;
        this.dom.classList.remove("edition");
        this.box.enableSelection();
        this.displayContent();
        this.input.removeEventListener("keyup", this.onEditionKeyUp);
    }

    onEditionKeyUp = e => {
        switch(e.key){
            case "Escape":
                e.preventDefault();
                this.cancelEdition();
                break;
            case "Enter":
                if(!e.shiftKey){
                    this.endEdition();
                }
                break;
        }
    }

    endEdition(){
        if(!this.isEditing){
            return;
        }
        const newContent = this.input.innerText.trim();
        this.context.boxesActions.editBoxContent(this, newContent);
        this.disableEdition();
    }

    cancelEdition(){
        this.displayContent();
        this.disableEdition();
    }

    displayInput(){
        this.input.innerText = this.value;
    }

    displayContent(){
        const content = this.value.replace(/  \n/g, "<br>");
        if(content !== this.display.innerHTML){
            this.display.innerHTML = content;
            this.box.updateRelatedLinks();
            setTimeout(() =>{
				this.box.updateRelatedLinks();
				this.display.querySelectorAll('pre').forEach((el) => {
					hljs.highlightElement(el, {language:"javascript"});
				});
			}, 300);
        }
    }
}
