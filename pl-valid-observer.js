import { PlElement, css } from 'polylib';

class PlValidObserver extends PlElement {
    static properties = {
        invalid: { type: Boolean, value: false },
        targetContainer: { type: Object }
    };

    static css = css`
        :host {
            display: none;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.target = this.targetContainer || this.parentNode;
        this.target.addEventListener('validation-changed', this._handlerValid.bind(this));
        if (!this.registerHook) {
            // Polylib before v1.2.0 doesn't have hook support, use repeater dom-changed event
            this.target.addEventListener('dom-changed', this._handlerValid.bind(this));
        }
    }

    #watchList = new Set();
    _handlerValid(event) {
        if (this._awaiter) clearTimeout(this._awaiter);

        // Подписываемся на хук компонента, поскольку событие из него не дойдет при удалении из DOM дерева
        if (event && !this.#watchList.has(event.target)) {
            event.target.registerHook?.('disconnected', () => {
                this._handlerValid();
                this.#watchList.delete(event.target);
            });
            this.#watchList.add(event.target);
        }

        this._awaiter = setTimeout(() => {
            const cmps = [...this.target.querySelectorAll('*')];
            this.invalid = cmps.some(x => x !== this && x.invalid);
        }, 100);
    }
}

customElements.define('pl-valid-observer', PlValidObserver);
