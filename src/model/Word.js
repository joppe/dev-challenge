import Backbone from 'backbone';
import {Chars} from 'js/collection/Chars';

export class Word extends Backbone.Model {
    get defaults() {
        return {
            chars: new Chars()
        };
    }

    constructor(attributes, options) {
        super(attributes, options);

        this.get('word').split('').forEach((char) => {
            this.get('chars').add({
                char: char
            });
        });
    }

    matchEnd(str) {
        return this.get('word').substr(this.length() - str.length, this.length()) === str;
    }

    matchStart(str) {
        return this.get('word').substr(0, str.length) === str;
    }

    removeStr(str) {
        if (this.matchStart(str)) {
            return new Word({
                word: this.get('word').substr(str.length)
            });
        } else if (this.matchEnd(str)) {
            return new Word({
                word: this.get('word').substr(0, this.length() - str.length)
            });
        }

        return this;
    }

    removeEnd(str) {
        if (this.matchEnd(str)) {
            return new Word({
                word: this.get('word').substr(0, this.length() - str.length)
            });
        }

        return this;
    }

    removeStart(str) {
        if (this.matchStart(str)) {
            return new Word({
                word: this.get('word').substr(str.length)
            });
        }

        return this;
    }

    value() {
        return this.get('word');
    }

    length() {
        return this.get('word').length;
    }

    toString() {
        return this.value();
    }
}
