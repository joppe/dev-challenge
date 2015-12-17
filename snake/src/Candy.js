import {Drawable} from './Drawable.js';

export class Candy extends Drawable {
    /**
     * @param {Vector} position
     * @param {Number} size
     */
    constructor(position, size) {
        super(position, size);

        this.element.setAttribute('class', 'candy');
    }
}