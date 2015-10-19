import Backbone from 'backbone';
import {Buffer} from 'js/model/Buffer';

export class Matcher extends Backbone.Model {
    get defaults() {
        return {
        };
    }

    matchAtStart(words) {
        let firstWord = words.first(),
            rest = words.without(firstWord),
            matches = true,
            index = 0,
            position = 0,
            buffer = new Buffer();

        if (firstWord && rest.length > 0) {
            while (matches) {
                let char = firstWord.get('chars').at(index),
                    str = buffer.value() + char.value();

                matches = _.some(rest, (word) => {
                    return word.matchStart(str, position);
                });

                index += 1;

                if (matches) {
                    buffer.append(char);
                }
            }
        }

        return buffer;
    }

    matchAtEnd(words) {
        let firstWord = words.first(),
            rest = words.without(firstWord),
            matches = true,
            index = 0,
            position = 0,
            buffer = new Buffer();

        if (firstWord && rest.length > 0) {
            while (matches) {
                let char = firstWord.get('chars').atEnd(index),
                    str = char.value() + buffer.value();

                matches = _.some(rest, (word) => {
                    return word.matchEnd(str, position);
                });

                index += 1;

                if (matches) {
                    buffer.prepend(char);
                }
            }
        }

        return buffer;
    }
}
