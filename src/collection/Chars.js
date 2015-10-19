import Backbone from 'backbone';
import {Char} from 'js/model/Char';

export class Chars extends Backbone.Collection {
    get model() {
        return Char;
    }

    atEnd(index) {
        let length = this.length;

        if (index >= length) {
            return null;
        }

        return this.at((length - 1) - index);
    }
}
