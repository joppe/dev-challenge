export class Drawable {
    /**
     * @param {number} size
     */
    constructor(size) {
        this.size = size;

        this.element = document.createElement('div');
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
    }

    getPosition() {
        return this.position;
    }

    /**
     * @param {Vector} position
     * @return {Drawable}
     */
    setPosition(position) {
        this.position = position;

        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';

        return this;
    }

    /**
     * @param {HTMLElement} container
     */
    draw(container) {
        container.appendChild(this.element);
    }

    remove() {
        this.element.parentElement.removeChild(this.element);
    }

    hide() {
        this.element.style.visibility = 'hidden';
    }

    show() {
        this.element.style.visibility = 'visible';
    }
}