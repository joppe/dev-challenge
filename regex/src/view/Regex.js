import React from 'react';
import {ReactView} from 'js/view/ReactView.js';
import {Test} from 'js/view/Test.js';
import {Result as TestResult} from 'js/model/Result.js';
import {Result} from 'js/view/Result.js';

export class Regex extends ReactView {
    constructor(props) {
        super(props);

        this.listener.listenTo(this.props.compiler, 'change', function () {
            this.forceUpdate();
        }.bind(this));
    }

    render() {
        let output = this.props.compiler.get('output'),
            result = new TestResult();

        if (output) {
            return (
                <div className="col-xs-6">
                    <h2>Output</h2>
                    <code>{output}</code>
                    <Test regex={this.props.regex} result={result} />
                    <Result result={result} />
                </div>
            );
        } else {
            return (
                <div className="col-xs-6">
                </div>
            );
        }
    }
}