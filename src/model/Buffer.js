import Backbone from 'backbone';

export class Buffer extends Backbone.Model {
    get defaults() {
        return {
            str: ''
        };
    }

    reset() {
        this.set('str', '');
    }

    append(str) {
        this.set('str', this.get('str') + str);
    }

    prepend(str) {
        this.set('str', str + this.get('str'));
    }

    value() {
        return this.get('str');
    }

    length() {
        return this.get('str').length;
    }

    toString() {
        return this.value();
    }
}
