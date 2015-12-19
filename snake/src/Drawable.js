export class Drawable {
    /**
     * @param {number} size
     * @param {boolean} useTransform
     */
    constructor(size, useTransform = true) {
        this.useTransform = useTransform;

        this.element = document.createElement('div');

        this.setDimensions(size);
    }

    setDimensions(size) {
        this.size = size;
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

        if (this.useTransform) {
            this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        } else {
            this.element.style.left = this.position.x + 'px';
            this.element.style.top = this.position.y + 'px';
        }

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