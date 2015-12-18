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
        this.score = 0;

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
        let x = random(0, this.vector.x),
            y = random(0, this.vector.y),
            v = new Vector(x, y);

        v = v.multiply(new Vector(this.size, this.size));

        if (null !== other && v.isSame(other)) {
            v = this.randomPosition(other);
        }

        return v;
    }

    /**
     * @returns {boolean}
     */
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

    /**
     * @returns {boolean}
     */
    canEat() {
        let eat = false;

        if (this.snake.getPosition().isSame(this.candy.getPosition())) {
            eat = true;
        }

        return eat;
    }

    cycle() {
        window.setTimeout(() => {
            this.snake.update();

            if (this.hitDetection()) {
                throw 'Out of area';
            }

            if (this.canEat()) {
                this.snake.grow(3);
                this.placeCandy();
            }

            this.cycle();
        }, 300);
    }

    placeCandy() {
        let snakePosition = this.randomPosition(),
            candyPosition = this.randomPosition(snakePosition);

        this.candy.move(candyPosition);
    }

    start() {
        let snakePosition = this.randomPosition(),
            candyPosition = this.randomPosition(snakePosition),
            unitVector = new Vector(this.size, this.size),
            up = directions.up.multiply(unitVector),
            right = directions.right.multiply(unitVector),
            down = directions.down.multiply(unitVector),
            left = directions.left.multiply(unitVector),
            direction = snakePosition.x > ((this.size * this.vector.x) / 2) ? left : right,
            controls = new Controls(this.element);

        this.snake = new Snake(snakePosition, this.size, direction);
        this.snake.draw(this.element);
        this.snake.grow(3);

        this.candy = new Candy(candyPosition, this.size);
        this.candy.draw(this.element);

        try {
            controls.addListener(controls.findCode('up'), () => {
                this.snake.move(up);
            });

            controls.addListener(controls.findCode('down'), () => {
                this.snake.move(down);
            });

            controls.addListener(controls.findCode('left'), () => {
                this.snake.move(left);
            });

            controls.addListener(controls.findCode('right'), () => {
                this.snake.move(right);
            });
        } catch (e) {
            console.log(e);
        }

        this.cycle();
    }
}