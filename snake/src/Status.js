export class Status {
    constructor() {
        this.status = 'idle';

        this.element = document.createElement('div');
        this.element.setAttribute('class', 'status');
    }

    /**
     * @param {HTMLElement} container
     */
    draw(container) {
        this.render();

        container.appendChild(this.element);
    }

    /**
     * @param {string} status
     */
    update(status) {
        this.status = status;

        this.render();
    }

    render() {
        this.element.innerText = `Status: ${this.status}`;
    }
}