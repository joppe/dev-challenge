import Backbone from 'backbone';
import {Word} from 'js/model/Word.js';

export class Words extends Backbone.Collection {
    get model() {
        return Word;
    }
}
