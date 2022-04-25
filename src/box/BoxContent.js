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
        const content = replaceTagsInPre(
			this.value.replace(/  \n/g, "<br>")
		);

        if(content !== this.display.innerHTML){
            this.display.innerHTML = content;
			this.display.querySelectorAll('pre').forEach((el) => {
				hljs.highlightElement(el, {language:"javascript"});
			});
            this.box.updateRelatedLinks();
            setTimeout(() =>{
				this.box.updateRelatedLinks();

				this.context.updateTitle();
			}, 300);
        }
    }
}


function replaceTagsInPre(content){
	const preMatches = [...content.matchAll(/<\/?pre>/g)];
	const prePairs = [];
	let pair = [];
	preMatches.forEach(match => {
		if(match[0] === "<pre>" && pair.length === 0){
			pair.push(match.index);
		}
		else if(match[0] === "</pre>" && pair.length === 1){
			pair.push(match.index);
			prePairs.push(pair);
			pair = [];
		}
	});
	const tagsMatches = [...content.matchAll(/</g)];
	const indicesToReplace = [];
	tagsMatches.forEach(t => {
		prePairs.some(pair => {
			if(pair[0] < t.index && pair[1] > t.index){
				indicesToReplace.push(t.index);
			}
		});
	});
	indicesToReplace.sort((a, b) => b - a);
	let result = content;
	const replacement = "&lt;";
	indicesToReplace.forEach(index => {
		result = result.substring(0, index) + replacement + result.substring(index + 1);
	});
	return result;
}
