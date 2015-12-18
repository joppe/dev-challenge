import {InvalidDirectionException} from './InvalidDirectionException.js';
import {Drawable} from './Drawable.js';

class Segment extends Drawable {
    /**
     * @param {Vector} position
     * @param {Number} size
     */
    constructor(position, size) {
        super(position, size);

        this.element.setAttribute('class', 'segment');
    }
}

export class Snake {
    /**
     * @param {Vector} position
     * @param {Number} size
     * @param {Vector} direction
     */
    constructor(position, size, direction) {
        this.position = position;
        this.size = size;
        this.direction = direction;

        this.segments = [new Segment(this.position, this.size)];
    }

    /**
     * @param {Vector} direction
     * @returns {boolean}
     */
    move(direction) {
        if ((2 * this.size) === Math.abs(direction.x - this.direction.x) || (2 * this.size) === Math.abs(direction.y - this.direction.y)) {
            return false;
        }

        this.direction = direction;

        return true;
    }

    /**
     * @param {HTMLElement} container
     */
    draw(container) {
        let position = this.position;

        this.container = container;

        this.segments.forEach((segment) => {
            segment.move(position);
            segment.draw(this.container);

            position = segment.getPosition();
        })
    }

    update() {
        let position = this.direction.add(this.getPosition());

        this.segments.forEach((segment) => {
            let newPosition = segment.getPosition();

            segment.move(position);
            position = newPosition;
        })
    }

    /**
     * @returns {Vector}
     */
    getPosition() {
        return this.segments[0].getPosition();
    }

    /**
     * The new segments are placed on top of the last segment.
     * This way the growth will be visible when the snake moves away.
     *
     * @param {Number} count
     */
    grow(count) {
        let position = this.segments[this.segments.length - 1].getPosition();

        for (let i = 0; i < count; i += 1) {
            let segment = new Segment(position, this.size);
            segment.draw(this.container);
            this.segments.push(segment);
        }
    }

    /**
     * @param {Vector} position
     * @param {array} exclude
     * @returns {boolean}
     */
    contains(position, exclude = []) {
        return this.segments.some((segment, index) => {
            if (-1 !== exclude.indexOf(index)) {
                return false;
            }

            return position.isSame(segment.getPosition());
        });
    }

    /**
     * @returns {Number}
     */
    getSegmentCount() {
        return this.segments.length;
    }
}