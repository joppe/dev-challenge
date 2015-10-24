export class Vector {
    /**
     * @param {Point} start
     * @param {Point} end
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    /**
     *
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.start.copy(), this.end.copy());
    }

    /**
     * @returns {Number}
     */
    width() {
        return this.end.x - this.start.x;
    }

    /**
     * @returns {Number}
     */
    height() {
        return this.end.y - this.start.y;
    }

    /**
     * @returns {Number}
     */
    length() {
        var adjacent = this.width(),
            opposite = this.height();

        return Math.sqrt(adjacent * adjacent + opposite * opposite);
    }

    /**
     * @returns {Number}
     */
    angle() {
        return Math.atan2(this.width(), this.height());
    }

    /**
     * @param {Vector} vector
     */
    add(vector) {
        this.end.x += vector.width();
        this.end.y += vector.height();
    }

    /**
     * @param {Vector} vector
     */
    sub(vector) {
        this.end.x -= vector.width();
        this.end.y -= vector.height();
    }

    /**
     * @param {Number} scale
     */
    scale(scale) {
        this.end.x *= scale;
        this.end.y *= scale;
    }

    negate() {
        var start = this.start.copy(),
            end = this.end.copy();

        this.start = end;
        this.end = new Point(start.x - end.x, start.y - end.y);
    }

    /**
     * @param {Number} angle
     */
    rotate(angle) {
        var width = this.width(),
            height = this.height(),
            cos = Math.cos(angle),
            sin = Math.sin(angle);

        this.end.x = width * cos - height * sin;
        this.end.y = width * sin + height * cos;
    }

    /**
     * @returns {string}
     */
    toString() {
        return 'start = ' + this.start.toString() + ' | ' + 'end = ' + this.end.toString();
    }
}