import {Drawable} from './Drawable.js';

export class Candy extends Drawable {
    /**
     * @param {Vector} position
     * @param {number} size
     */
    constructor(position, size) {
        super(position, size);

        this.element.setAttribute('class', 'candy');
    }
}