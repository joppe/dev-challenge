import Backbone from 'backbone';
import {Words} from 'js/collection/Words.js';

export const PREFFIX = 1;
export const SUFFIX = 2;

export class Group extends Backbone.Model {
    get defaults() {
        return {
            type: null,
            str: '',
            words: new Words(),
            group: null
        };
    }

    consume(word) {
        this.get('words').add(word);
    }

    build(matcher) {
        let words = this.get('words'),
            start = matcher.matchAtStart(words),
            end = matcher.matchAtEnd(words),
            group;

        if (start.value() || end.value()) {
            if (start.length() >= end.length()) {
                group = new Group({
                    type: PREFFIX,
                    str: start.value()
                });
            } else {
                group = new Group({
                    type: SUFFIX,
                    str: end.value()
                });
            }
        }

        if (group) {
            let remove = [];

            words.each((word) => {
                let short;

                if (group.get('type') === PREFFIX) {
                    short = word.removeStart(group.get('str'));
                } else if (group.get('type') === SUFFIX) {
                    short = word.removeEnd(group.get('str'));
                }

                if (short !== word) {
                    remove.push(word);
                    group.consume(short);
                }
            });

            this.set('group', group);
            this.get('words').remove(remove);

            // add delay
            group.build(matcher);
        }
    }
}
