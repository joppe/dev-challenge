/*global document*/

import {Game} from './Game.js';
import {Vector} from './Vector.js';

/**
 *
 * Create an element where the snake can move, the area
 * Create the snake, it needs the area element so it can draw itself.
 * The snake consists of segments. A segment draws itself. But the snake is responsible of calling the draw method
 * on each segment.
 * The snake has a move method, that accepts a vector.
 * The game object update itself when the game is started. It listens to key strokes to move the snake.
 * The game object has a collision detection function.
 */
(function () {
    var game = new Game(new Vector(30, 30), 10);

    game.draw(document.body);
    game.start();
}());
