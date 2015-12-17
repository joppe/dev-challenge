/*global document*/

export class Controls {
    get map() {
        return {
            up: 38,
            left: 37,
            right: 39,
            down: 40,
            space: 32
        };
    }

    /**
     * @param {HTMLElement} container
     */
    constructor(container) {
        this.listeners = {};

        this.element = document.createElement('input');
        this.element.setAttribute('type', 'text');

        container.appendChild(this.element);

        this.element.focus();
        this.element.addEventListener('keyup', this.handleKey.bind(this));
    }

    /**
     * @param {string} key
     * @returns {Number}
     */
    findCode(key) {
        return this.map[key];
    }

    /**
     * @param {Number} keycode
     * @param {Function} callback
     */
    addListener(keycode, callback) {
        if (undefined === this.listeners[keycode]) {
            this.listeners[keycode] = [];
        }

        this.listeners[keycode].push(callback);
    }

    /**
     * @param {Event} event
     */
    handleKey(event) {
        if (undefined !== this.listeners[event.keyCode]) {
            this.listeners[event.keyCode].forEach((callback) => {
                callback.call(this, event);
            });
        }
    }
}