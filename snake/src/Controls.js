/*global document*/

export class Controls {
    get map() {
        return {
            r: 82,
            up: 38,
            left: 37,
            right: 39,
            down: 40,
            space: 32
        };
    }

    constructor() {
        this.listeners = {};

        document.body.addEventListener('keydown', this.handleKey.bind(this));
    }

    /**
     * @param {string} key
     * @returns {number}
     */
    findCode(key) {
        return this.map[key];
    }

    /**
     * @param {number} keycode
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

    reset() {
        this.listeners = {};
    }
}