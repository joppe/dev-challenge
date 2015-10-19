import Backbone from 'backbone';

export class Char extends Backbone.Model {
    get defaults() {
        return {
            char: '',
            try: null,
            match: null
        };
    }

    value() {
        return this.get('char');
    }

    toString() {
        return this.value();
    }
}
