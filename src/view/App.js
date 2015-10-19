import React from 'react';
import {ReactView} from 'js/view/ReactView';
import {Words} from 'js/view/Words';
import {Input} from 'js/view/Input';
import {Regex} from 'js/view/Regex';
import {Process} from 'js/view/Process';

export class App extends ReactView {
    handleReset() {
        this.props.regex.reset();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h1 className="col-xs-9">Regexp generator</h1>
                    <a className="pull-right" href="javascript:void(null);" onClick={this.handleReset.bind(this)}>reset</a>
                </div>
                <div className="col-xs-6">
                    <Words words={this.props.regex.get('words')} removable={true} />
                    <Input regex={this.props.regex}  />
                    <Process regex={this.props.regex} />
                </div>
                <Regex compiler={this.props.regex.get('compiler')} regex={this.props.regex} />
            </div>
        );
    }
}