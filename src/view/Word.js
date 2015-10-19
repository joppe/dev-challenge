import React from 'react';
import {ReactView} from 'js/view/ReactView';
import {Char} from 'js/view/Char';

export class Word extends ReactView {
    handleRemove() {
        this.props.words.remove(this.props.word);
    }

    render() {
        let chars = this.props.word.get('chars').map((char) => {
                return (
                    <Char char={char} word={this.props.word} />
                );
            });

        return (
            <tr>
                <td>{chars}</td>
                <td><button type="button" className="btn btn-default" onClick={this.handleRemove.bind(this)}><span className="glyphicon glyphicon-remove"></span></button></td>
            </tr>
        );
    }
}