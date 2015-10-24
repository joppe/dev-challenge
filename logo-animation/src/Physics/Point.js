export class Point {
    /**
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {Point}
     */
    copy() {
        return new Point(this.x, this.y);
    }

    /**
     * @returns {string}
     */
    toString() {
        return 'x: ' + this.x + '; y: ' + this.y;
    }
}