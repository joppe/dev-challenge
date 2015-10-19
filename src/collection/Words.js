import Backbone from 'backbone';
import {Word} from 'js/model/Word';

export class Words extends Backbone.Collection {
    get model() {
        return Word;
    }
}
