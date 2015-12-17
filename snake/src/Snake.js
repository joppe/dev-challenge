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

    move(direction) {
        if (2 === Math.abs(direction.x - this.direction.x) || 2 === Math.abs(direction.y - this.direction.y)) {
            throw new InvalidDirectionException('Cannot move in opposite direction');
        }

        this.direction = direction;
    }

    /**
     * @param {HTMLElement} container
     */
    draw(container) {
        let position = this.direction;

        this.segments.forEach((segment) => {
            segment.move(position);
            segment.draw(container);

            position = segment.getPosition();
        })
    }

    update() {
        let position = this.direction;

        this.segments.forEach((segment) => {
            segment.move(position);
            position = segment.getPosition();
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
            this.segments.push(new Segment(position, this.size));
        }
    }

    /**
     * @param {Vector} position
     * @returns {boolean}
     */
    contains(position) {
        return this.segments.some((segment) => {
            return position.isSame(segment.getPosition());
        });
    }
}