import Signal from "./signal";

function getNumericStyleProperty(style, prop) {
    return parseInt(style.getPropertyValue(prop), 10);
}

export function elementPosition(e) {
    let x = 0, y = 0;
    let inner = true ;
    do {
        x += e.offsetLeft;
        y += e.offsetTop;
        const style = window.getComputedStyle(e,null) ;
        const borderTop = getNumericStyleProperty(style,"border-top-width") ;
        const borderLeft = getNumericStyleProperty(style,"border-left-width") ;
        y += borderTop ;
        x += borderLeft ;
        if (inner) {
            const paddingTop = getNumericStyleProperty(style,"padding-top") ;
            const paddingLeft = getNumericStyleProperty(style,"padding-left") ;
            y += paddingTop ;
            x += paddingLeft ;
        }
        inner = false ;
    } while (Boolean(e = e.offsetParent));
    return { x: x, y: y };
}

export default class Mouse {
    constructor(target) {
        this.x = this.y = 0;
        this.isDown = false;
        this.isRightDown = false;
        this.target = target || document;

        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onDrag = new Signal();

        this.onMiddleDown = new Signal();
        this.onMiddleDrag = new Signal();
        this.onMiddleUp = new Signal();

        this.onRightDown = new Signal();
        this.onRightDrag = new Signal();
        this.onRightUp = new Signal();

        this.onMove = new Signal();
        this.onWheel = new Signal();

        this._moveBind = this._onMouseMove.bind(this);
        this._downBind = this._onMouseDown.bind(this);
        this._upBind = this._onMouseUp.bind(this);

        this._touchMoveBind = this._onTouchMove.bind(this);
        this._touchStartBind = this._onTouchStart.bind(this);
        this._touchEndBind = this._onTouchEnd.bind(this);

        this._wheelBind = this._onMouseWheel.bind(this);
        this._contextBind = (e) => {e.preventDefault(); return false;};
        this._enabled = false;
    }

    enable() {
        if(this._enabled){
            return;
        }
        document.addEventListener("mousemove", this._moveBind);
        this.target.addEventListener("mousedown", this._downBind);
        document.addEventListener("mouseup", this._upBind);

        document.addEventListener("touchmove", this._touchMoveBind);
        this.target.addEventListener("touchstart", this._touchStartBind);

        this.target.addEventListener("mousewheel", this._wheelBind);
        this.target.addEventListener("DOMMouseScroll", this._wheelBind);
        this.target.addEventListener("contextmenu", this._contextBind);
        this._enabled = true;
    }

    disable() {
        document.removeEventListener("mousemove", this._moveBind);
        this.target.removeEventListener("mousedown", this._downBind);
        document.removeEventListener("mouseup", this._upBind);

        document.removeEventListener("touchmove", this._touchMoveBind);
        this.target.removeEventListener("touchstart", this._touchStartBind);
        document.removeEventListener("touchend", this._touchEndBind);

        this.target.removeEventListener("mousewheel", this._wheelBind);
        this.target.removeEventListener("DOMMouseScroll", this._wheelBind);
        this.target.removeEventListener("contextmenu", this._contextBind);
        this._enabled = false;
    }

    _updatePositionFromEvent(e){
        const p = elementPosition(this.target);
        this.x = ((e.pageX || (e.touches && e.touches[0] && e.touches[0].pageX)) - p.x) || 0;
        this.y = ((e.pageY || (e.touches && e.touches[0] && e.touches[0].pageY)) - p.y) || 0;
    }

    _onMouseMove(e) {
        this._updatePositionFromEvent(e);
        this.onMove.dispatch(e);
        if(this.isDown){
            this.onDrag.dispatch(e);
        }
        if(this.isMiddleDown){
            this.onMiddleDrag.dispatch(e);
        }
        if(this.isRightDown){
            this.onRightDrag.dispatch(e);
        }
    }

    _onMouseDown(e) {

        if(this.isTouching){
            return false;
        }
        this._updatePositionFromEvent(e);
        if(!e.which){
            this.isDown = true;
            this.onDown.dispatch(e);
            return false;
        }
        switch(e.which){
            case 1:
                this.isDown = true;
                this.onDown.dispatch(e);
                break;
            case 2:
                this.isMiddleDown = true;
                this.onMiddleDown.dispatch(e);
                break;
            case 3:
                this.isRightDown = true;
                this.onRightDown.dispatch(e);
                break;
        }
        return false;
    }

    _onMouseUp(e, isForced = false) {
        if(!isForced && this.isTouching){
            return false;
        }
        this._updatePositionFromEvent(e);
        if(!e.which){
            this.isDown = false;
            this.onUp.dispatch(e);
            return false;
        }
        switch(e.which){
        case 1:
            this.isDown = false;
            this.onUp.dispatch(e);
            break;
        case 2:
            this.isMiddleDown = false;
            this.onMiddleUp.dispatch(e);
            break;
        case 3:
            this.isRightDown = false;
            this.onRightUp.dispatch(e);
            break;
        }
        return false;
    }

    _onMouseWheel(event) {
        let delta = 0;
        if ( event.wheelDelta !== undefined ) {
            delta = event.wheelDelta;
        } else if ( event.detail !== undefined ) {
			      delta = - event.detail;
		    }
        this.onWheel.dispatch(delta);
    }

    _onTouchStart(e){
        e.preventDefault();
        this.target.addEventListener("touchend", this._touchEndBind, {passive:false});
        this._onMouseDown(e);
        this.isTouching = true;
    }

    _onTouchEnd(e){
        e.preventDefault();
        this.target.removeEventListener("touchend", this._touchEndBind);
        this._onMouseUp(e, true);
        this.isTouching = false;
    }

    _onTouchMove(e){
        e.preventDefault();
        this._onMouseMove(e);
    }

    setCursor(type = "default") {
        this.target.style.cursor = type;
    }

    dispose() {
        this.onDown.dispose();
        this.onUp.dispose();
        this.onMove.dispose();

        this.onMiddleDown.dispose();
        this.onMiddleUp.dispose();
        this.onMiddleMove.dispose();

        this.onRightDown.dispose();
        this.onRightUp.dispose();
        this.onRightMove.dispose();

        this.disable();
    }
}
