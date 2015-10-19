import React from 'react';
import {ReactView} from 'js/view/ReactView';

export class Process extends ReactView {
    constructor(props) {
        super(props);

        let words = this.props.regex.get('words');

        this.listener.listenTo(words, 'add remove reset', function () {
            this.forceUpdate();
        }.bind(this));
    }

    process() {
        this.props.regex.process();
    }

    render() {
        let top = 25;

        if (this.props.regex.get('words').length > 0) {
            return (
                <div style={{paddingTop: top + 'px'}}>
                    <button type="button" className="btn btn-danger" onClick={this.process.bind(this)}>Compile regexp</button>
                </div>
            );
        } else {
            return (
                <div style={{paddingTop: top + 'px'}}>
                    <em>Please add word(s)</em>
                </div>
            );
        }
    }
}