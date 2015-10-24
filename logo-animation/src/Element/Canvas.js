export class Canvas {
    constructor(width = '400', height = '400') {
        this.width = width;
        this.height = height;

        this.el = document.createElement('canvas');
        this.el.setAttribute('width', this.width);
        this.el.setAttribute('height', this.height);

        this.ctx = this.el.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    getSize() {
        return {
            width: this.width,
            height: this.height
        };
    }

    getContext() {
        return this.ctx;
    }

    getElement() {
        return this.el;
    }
}