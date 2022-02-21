import { PlElement, css } from "polylib";

class PlValidObserver extends PlElement {
    static get properties() {
        return {
            invalid: {
                type: Boolean,
                value: false
            },
            targetContainer: {
                type: Object
            }
        }
    }

    static get css(){
        return css`
            :host {
                display: none;
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.target = this.targetContainer || this.parentNode;
        this.target.addEventListener('validation-changed', this._handlerValid.bind(this));
        this.target.addEventListener('dom-changed', this._handlerValid.bind(this));
    }

    _handlerValid() {
        if (this._awaiter)
            clearTimeout(this._awaiter);
        this._awaiter = setTimeout(() => {
            let cmps = [...this.target.querySelectorAll('*')];
            this.invalid = cmps.some(x => x != this && x.invalid);
        }, 100);
    }
}

customElements.define('pl-valid-observer', PlValidObserver);
