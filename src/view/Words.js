import React from 'react';
import {ReactView} from 'js/view/ReactView';
import {Word} from 'js/view/Word';

export class Words extends ReactView {
    constructor(props) {
        super(props);

        this.watchCollection(this.props.words);
    }

    render() {
        let words = this.props.words.map((word) => {
                return (
                    <Word words={this.props.words} word={word} removable={this.props.removable} />
                );
            });

        return (
            <table className="table">
                {words}
            </table>
        );
    }
}