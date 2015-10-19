import React from 'react';
import {ReactView} from 'js/view/ReactView';

export class Result extends ReactView {
    constructor(props) {
        super(props);

        this.listener.listenTo(this.props.result, 'change', function () {
            this.forceUpdate();
        }.bind(this));
    }

    render() {
        let result = this.props.result.get('result'),
            top = 25;

        if (null !== result) {
            let str = result ? 'pass' : 'fail';

            return (
                <div style={{paddingTop: top + 'px'}}>
                    <code>{str}</code>
                </div>
            );
        } else {
            return (
                <span></span>
            )
        }
    }
}