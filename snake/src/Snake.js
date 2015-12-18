import {InvalidDirectionException} from './InvalidDirectionException.js';
import {Drawable} from './Drawable.js';

class Segment extends Drawable {
    /**
     * @param {number} size
     */
    constructor(size) {
        super(size);

        this.element.setAttribute('class', 'segment');
    }
}

export class Snake extends Drawable {
    /**
     * @param {number} size
     */
    constructor(size) {
        super(size);

        this.element.setAttribute('class', 'snake');

        this.segments = [];
    }

    /**
     * @param {Vector} position
     * @return {Drawable}
     */
    setPosition(position) {
        this.position = position;

        return this;
    }

    /**
     * @param {Vector} direction
     * @returns {Snake}
     */
    setDirection(direction) {
        this.direction = direction;

        return this;
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

    reset() {
        this.segments.forEach((segment) => {
            segment.remove();
        });

        this.segments = [];
    }

    update() {
        let position = this.direction.add(this.position);

        this.position = position;

        this.segments.forEach((segment) => {
            let newPosition = segment.getPosition();

            segment.setPosition(position);

            if (undefined !== newPosition) {
                position = newPosition;
            }
        })
    }

    /**
     * The new segments are placed on top of the last segment.
     * This way the growth will be visible when the snake moves away.
     *
     * @param {number} count
     */
    grow(count) {
        for (let i = 0; i < count; i += 1) {
            let segment = new Segment(this.size);

            segment.setPosition(this.position);
            segment.draw(this.element);

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
     * @returns {number}
     */
    length() {
        return this.segments.length;
    }
}