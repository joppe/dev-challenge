import {Vector} from './Vector.js';
import {Snake} from './Snake.js';
import {Controls} from './Controls.js';
import {Candy} from './Candy.js';
import {Score} from './Score.js';
import {Status} from './Status.js';
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
        this.score = new Score();
        this.status = new Status();

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

        this.score.draw(container);
        this.status.draw(container);
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
            this.size > this.snake.getPosition().x ||
            (this.size * this.vector.x) < this.snake.getPosition().x ||
            this.size > this.snake.getPosition().y ||
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
                    this.snake.grow(3);
                    this.placeCandy();

                    this.score.add(5);
                }

                if (false === this.pause) {
                    this.cycle();
                }
            } else {
                this.status.update('Game over');
            }
        }, 200);
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
            controls = new Controls();

        this.dead = false;
        this.pause = false;
        this.snake = new Snake(snakePosition, this.size, direction);
        this.snake.draw(this.element);
        this.snake.grow(0);

        this.candy = new Candy(candyPosition, this.size);
        this.candy.draw(this.element);

        this.score.reset();
        this.status.update('start');

        controls.addListener(controls.findCode('up'), () => {
            this.dead = !this.snake.move(up);
        });

        controls.addListener(controls.findCode('down'), () => {
            this.dead = !this.snake.move(down);
        });

        controls.addListener(controls.findCode('left'), () => {
            this.dead = !this.snake.move(left);
        });

        controls.addListener(controls.findCode('right'), () => {
            this.dead = !this.snake.move(right);
        });

        controls.addListener(controls.findCode('r'), () => {
            console.log('restart?');
            if (this.dead) {
                console.log('restart?');
                this.start();
            }
        });

        controls.addListener(controls.findCode('space'), () => {
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