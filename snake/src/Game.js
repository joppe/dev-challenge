import {Vector} from './Vector.js';
import {Snake} from './Snake.js';
import {Controls} from './Controls.js';
import {Candy} from './Candy.js';
import {directions} from './helper.js';
import {random} from './helper.js';

export class Game {
    /**
     * @param {Vector} vector
     * @param {Number} size
     */
    constructor(vector, size) {
        this.vector = vector;
        this.size = size;
        this.speed = 1;

        this.element = document.createElement('div');
        this.element.setAttribute('class', 'game');
        this.element.style.width = (this.size * this.vector.x) + 'px';
        this.element.style.height = (this.size * this.vector.y) + 'px';
    }

    /**
     * @param {HTMLElement} container
     */
    draw(container) {
        container.appendChild(this.element);
    }

    /**
     * @param {Vector|null} other
     * @returns {Vector}
     */
    randomPosition(other = null) {
        let x = random(0, this.size * this.vector.x),
            y = random(0, this.size * this.vector.y),
            v = new Vector(x, y);

        if (null !== other && v.isSame(other)) {
            v = this.randomPosition(other);
        }

        return v;
    }

    hitDetection() {
        let hit = false;

        if (
            0 > this.snake.getPosition().x ||
            (this.size * this.vector.x) < this.snake.getPosition().x ||
            0 > this.snake.getPosition().y ||
            (this.size * this.vector.y) < this.snake.getPosition().y
        ) {
            hit = true;
        }

        return hit;
    }

    cycle() {
        window.setTimeout(() => {
            this.snake.update();

            if (this.hitDetection()) {
                throw 'Out of area';
            }

            this.cycle();
        }, 30);
    }

    start() {
        let snakePosition = this.randomPosition(),
            candyPosition = this.randomPosition(snakePosition),
            direction = snakePosition.x > ((this.size * this.vector.x) / 2) ? directions.left : directions.right,
            controls = new Controls(this.element);

        this.snake = new Snake(snakePosition, this.size, direction);
        this.snake.draw(this.element);

        this.candy = new Candy(candyPosition, this.size);
        this.candy.draw(this.element);

        try {
            controls.addListener(controls.findCode('up'), () => {
                this.snake.move(directions.up);
            });

            controls.addListener(controls.findCode('down'), () => {
                this.snake.move(directions.down);
            });

            controls.addListener(controls.findCode('left'), () => {
                this.snake.move(directions.left);
            });

            controls.addListener(controls.findCode('right'), () => {
                this.snake.move(directions.right);
            });
        } catch (e) {
            console.log(e);
        }

        this.cycle();
    }
}