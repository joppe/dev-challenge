import {Vector} from './Vector.js';

/**
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function random(min, max) {
    return min + Math.round(Math.random() * max);
}

/**
 * @type {{up: Vector, right: Vector, down: Vector, left: Vector}}
 */
export var directions = {
    up: new Vector(0, -1),
    right: new Vector(1, 0),
    down: new Vector(0, 1),
    left: new Vector(-1, 0)
};