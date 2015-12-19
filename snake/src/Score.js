export class Score {
    constructor() {
        this.score = 0;

        this.element = document.createElement('div');
        this.element.setAttribute('class', 'score');
    }

    /**
     * @param {HTMLElement} container
     */
    draw(container) {
        this.render();

        container.appendChild(this.element);
    }

    reset() {
        this.score = 0;

        this.render();
    }

    /**
     * @param {number} score
     */
    add(score) {
        this.score += score;

        this.render();
    }

    render() {
        this.element.textContent = `Score: ${this.score}`;
    }

    /**
     * @returns {number}
     */
    getScore() {
        return this.score;
    }
}