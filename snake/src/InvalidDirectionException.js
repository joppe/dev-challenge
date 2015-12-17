export class InvalidDirectionException {
    constructor(message) {
        this.message = message;
    }

    toString() {
        return this.message;
    }
}