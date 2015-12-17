export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {Vector} vector
     * @returns {Vector}
     */
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /**
     * @returns {Vector}
     */
    clone() {
        return new Vector(this.x, this.y);
    }

    /**
     * @param {Vector} vector
     * @returns {boolean}
     */
    isSame(vector) {
        return this.x === vector.x && this.y === vector.y;
    }

    /**
     * @returns {string}
     */
    toString() {
        return `{x: ${this.x}, y: ${this.y}}`;
    }
}