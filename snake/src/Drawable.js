export class Drawable {
    /**
     * @param {Vector} position
     * @param {Number} size
     */
    constructor(position, size) {
        this.position = position;
        this.size = size;

        this.element = document.createElement('div');
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';

        this.positionElement();
    }

    getPosition() {
        return this.position;
    }

    /**
     * @param {Vector} vector
     */
    move(vector) {
        this.position = this.position.add(vector);

        this.positionElement();
    }

    positionElement() {
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
    }

    /**
     * @param {HTMLElement} container
     */
    draw(container) {
        container.appendChild(this.element);
    }

}