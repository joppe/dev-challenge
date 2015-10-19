import React from 'react';
import {ReactView} from 'js/view/ReactView';

export class Input extends ReactView {
    handleAdd(event) {
        let el = React.findDOMNode(this.refs.word);

        this.props.regex.addWord(el.value.trim());

        el.value = '';

        this.forceUpdate();
    }

    render() {
        return (
            <form className="form-inline">
                <div className="form-group">
                    <input className="form-control" placeholder="new word" ref="word" />
                </div>
                <button type="button" className="btn btn-primary" onClick={this.handleAdd.bind(this)}>Add</button>
            </form>
        );
    }
}