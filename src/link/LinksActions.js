export default class LinksActions{
    constructor(context){
        this.context = context;
    }

    createLink(originBox, box){
        const link = this.context.links.createLink(originBox, box);
        const exec = () => this.context.links.addLink(link);
        const action = this.context.undoStack.addAction({
            description:"create link",
            undo:() => this.context.links.removeLink(link),
            redo:() => exec()
        });
        exec();
        this.context.selection.setLinks([link]);
    }

    deleteLink(link){
        const exec = () => {
            this.context.links.removeLink(link);
        };
        this.context.undoStack.addAction({
            description:"delete link",
            undo:() => this.context.links.addLink(link),
            redo:() => exec()
        });
        exec();
        this.context.selection.removeLink(link);
    }

    setLinkDash(link, isDashed){
        const oldDash = link.isDashed;
        const exec = () => {
            link.setDashed(isDashed);
        };
        this.context.undoStack.addAction({
            description:"set link dash",
            undo:() => link.setDashed(oldDash),
            redo:() => exec()
        });
        exec();
    }

    setLinkColor(link, newColor){
        const oldColor = link.color;
        const exec = () => link.setColor(newColor);
        this.context.undoStack.addAction({
            description:"set link color",
            undo:() => link.setColor(oldColor),
            redo:() => exec()
        });
        exec();
        this.context.links.lastColor = newColor;
    }

    setLinkHeadType(linkHead, type){
        const prevType = linkHead.type;
        const exec = () => {
            linkHead.setType(type);
            linkHead.link.update();
        };
        this.context.undoStack.addAction({
            description:"set link head type",
            undo:() => {
                linkHead.setType(prevType);
                linkHead.link.update();
            },
            redo:() => exec(),
        });
        exec();
    }
}
