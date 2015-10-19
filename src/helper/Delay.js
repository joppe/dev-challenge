import {Listener} from 'js/helper/Listener';

export class Delay extends Listener {
    constructor(func) {
        super();

        this.func = func;
    }

    then(after) {
        this.after = after;

        return this;
    }

    start() {
        if (this.func instanceof Delay) {
            this.listenTo(this.func, 'finish', this.finish.bind(this));
            this.func.start();
        } else {
            this.func.call(null);
            this.finish();
        }
    }

    end() {
        if (this.after instanceof Delay) {
            this.after.start();
        } else {
            this.after.call(null);
        }

        this.trigger('finish');
    }

    finish() {
        this.stopListening();

        window.setTimeout(this.end.bind(this), 1000);
    }

    static when(func) {
        return new Delay(func);
    }
}