import {Vector} from './Vector.js';
import {Snake} from './Snake.js';
import {Controls} from './Controls.js';
import {Candy} from './Candy.js';
import {Score} from './Score.js';
import {Status} from './Status.js';
import {directions} from './helper.js';
import {random} from './helper.js';
import {square} from './helper.js';

const SPEED = 1;
const BASE_TIME = 350;
const SPEED_INCREASE = 0.05;

export class Game {
    /**
     * @param {Vector} vector
     * @param {number} size
     */
    constructor(vector, size) {
        this.vector = vector;
        this.size = size;
        this.snake = new Snake(this.size);
        this.candy = new Candy(this.size);
        this.score = new Score();
        this.status = new Status();
        this.controls = new Controls();

        this.unitVector = new Vector(this.size, this.size);
        this.up = directions.up.multiply(this.unitVector);
        this.right = directions.right.multiply(this.unitVector);
        this.down = directions.down.multiply(this.unitVector);
        this.left = directions.left.multiply(this.unitVector);

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

        this.snake.hide();
        this.snake.draw(this.element);

        this.candy.hide();
        this.candy.draw(this.element);

        this.score.draw(container);
        this.status.draw(container);
    }

    /**
     * @param {Vector|null} other
     * @returns {Vector}
     */
    randomPosition(other = null) {
        let x = random(1, this.vector.x - 3),
            y = random(1, this.vector.y - 3),
            v = new Vector(x, y);

        v = v.multiply(this.unitVector);

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

            if (this.snake.contains(this.snake.getPosition(), [0])) {
                this.dead = true;
            }

            if (this.hitDetection()) {
                this.dead = true;
            }

            if (false === this.dead) {
                if (this.canEat()) {
                    this.speed += SPEED_INCREASE;
                    this.status.update(`speed: ${this.speed}; ${SPEED_INCREASE}`);
                    this.snake.grow(3);
                    this.placeCandy();
                    this.score.add(3 * this.snake.length());
                }

                if (false === this.pause) {
                    this.cycle();
                }
            } else {
                this.status.update('Game over');
            }
        }, BASE_TIME / this.speed);
    }

    placeCandy() {
        let snakePosition = this.snake.getPosition(),
            candyPosition = this.randomPosition(snakePosition);

        this.candy.setPosition(candyPosition);
        this.candy.show();
    }

    placeSnake() {
        let snakePosition = this.randomPosition(),
            direction = snakePosition.x > ((this.size * this.vector.x) / 2) ? this.left : this.right;

        this.snake.setPosition(snakePosition);
        this.snake.setDirection(direction);
        this.snake.reset();
        this.snake.grow(1);
        this.snake.show();
    }

    start() {
        this.dead = false;
        this.pause = false;
        this.speed = SPEED;

        this.placeSnake();
        this.placeCandy();

        this.score.reset();
        this.status.update(`speed: ${this.speed}`);

        this.controls.reset();

        this.controls.addListener(this.controls.findCode('up'), () => {
            this.dead = !this.snake.move(this.up);
        });

        this.controls.addListener(this.controls.findCode('down'), () => {
            this.dead = !this.snake.move(this.down);
        });

        this.controls.addListener(this.controls.findCode('left'), () => {
            this.dead = !this.snake.move(this.left);
        });

        this.controls.addListener(this.controls.findCode('right'), () => {
            this.dead = !this.snake.move(this.right);
        });

        this.controls.addListener(this.controls.findCode('r'), () => {
            if (this.dead) {
                this.start();
            }
        });

        this.controls.addListener(this.controls.findCode('space'), () => {
            if (false === this.dead) {
                this.pause = !this.pause;
                this.status.update(this.pause ? 'pause' : 'playing');

                if (false === this.pause) {
                    this.cycle();
                }
            }
        });

        this.cycle();
    }
}