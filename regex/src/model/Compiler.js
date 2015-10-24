import Backbone from 'backbone';
import {Buffer} from 'js/model/Buffer.js';
import {PREFFIX} from 'js/model/Group.js';
import {SUFFIX} from 'js/model/Group.js';

let escapeRegExp;

escapeRegExp = (function () {
    let specials = [
            '-',
            '[',
            ']',
            '/',
            '{',
            '}',
            '(',
            ')',
            '*',
            '+',
            '?',
            '.',
            '\\',
            '^',
            '$',
            '|'
        ]
        , regex = new RegExp('[' + specials.join('\\') + ']', 'g');

    return function (str) {
        return str.replace(regex, '\\$&');
    };
}());

export class Compiler extends Backbone.Model {
    get defaults() {
        return {
            output: ''
        };
    }

    compile(group, depth = 0) {
        let buffer = new Buffer();

        buffer.append('(');

        group.get('words').each((word, index) => {
            if (index > 0) {
                buffer.append('|');
            }

            buffer.append(escapeRegExp(word.value()));
        });

        if (group.get('group')) {
            if (group.get('words').length > 0) {
                buffer.append('|');
            }
            buffer.append(this.compile(group.get('group'), depth + 1));
        }

        buffer.append(')');

        if (group.get('type') === PREFFIX) {
            buffer.prepend(group.get('str'));
        } else if (group.get('type') === SUFFIX) {
            buffer.append(group.get('str'));
        }

        if (0 === depth) {
            buffer.prepend('^');
            buffer.append('$');

            this.set('output', buffer.value());
        }

        return buffer;
    }

    reset() {
        this.set(this.defaults);
    }
}