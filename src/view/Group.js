import React from 'react';
import {ReactView} from 'js/view/ReactView';
import {Words} from 'js/view/Words';

export class Group extends ReactView {
    constructor(props) {
        super(props);

        this.watchModel(this.props.group);
    }

    render() {
        let top = 25,
            group = '';

        if (this.props.group.get('group')) {
            group = <Group group={this.props.group.get('group')} />
        }

        return (
            <div style={{paddingTop: top + 'px'}}>
                <h3>{this.props.group.get('str')}</h3>
                <p>{this.props.group.get('type')}</p>
                <Words words={this.props.group.get('words')} removable={false} />
                {group}
            </div>
        );
    }
}