import React from 'react';
import {ReactView} from 'js/view/ReactView.js';

export class Test extends ReactView {
    handleTest() {
        let el = React.findDOMNode(this.refs.word);

        this.props.result.set('result', this.props.regex.test(el.value));
    }

    render() {
        let top = 30;

        return (
            <form className="form-inline" style={{paddingTop: top + 'px'}}>
                <div className="form-group">
                    <input className="form-control" placeholder="test input" ref="word" />
                </div>
                <button type="button" className="btn btn-success" onClick={this.handleTest.bind(this)}>Test</button>
            </form>
        );
    }
}