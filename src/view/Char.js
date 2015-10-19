import React from 'react';
import {ReactView} from 'js/view/ReactView';

const DEFAULT_COLOR = 'transparent';
const TRY_COLOR = '#79A4B3';
const MATCH_COLOR = '#A579B3';

export class Char extends ReactView {
    constructor(props) {
        super(props);

        this.watchModel(this.props.char);
    }

    render() {
        let color = DEFAULT_COLOR;

        if (this.props.char.get('try')) {
            color = TRY_COLOR;
        } else if (this.props.char.get('match')) {
            color = TRY_COLOR;
        }

        return (
            <span style={{backgroundColor: color}}>{this.props.char.value()}</span>
        );
    }
}