import Backbone from 'backbone';
import {Group} from 'js/model/Group.js';
import {Words} from 'js/collection/Words.js';
import {Matcher} from 'js/model/Matcher.js';
import {Compiler} from 'js/model/Compiler.js';

export class Regex extends Backbone.Model {
    get defaults() {
        return {
            compiler: new Compiler(),
            matcher: new Matcher(),
            words: new Words(),
            group: new Group(),
            regexp: ''
        };
    }

    addWord(word) {
        this.get('words').add({word});
    }

    process() {
        let group = new Group();

        this.set('group', group);
        this.get('compiler').reset();

        group.set({
            words: this.get('words').clone()
        });

        group.build(this.get('matcher'));

        this.set('regexp', new RegExp(this.get('compiler').compile(this.get('group'))));
    }

    test(str) {
        return this.get('regexp').test(str);
    }

    reset() {
        this.get('compiler').reset();
        this.get('words').reset();
        this.set('group', new Group());
    }
}
