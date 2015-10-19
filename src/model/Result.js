import Backbone from 'backbone';

export class Result extends Backbone.Model {
    get defaults() {
        return {
            result: null
        };
    }
}
