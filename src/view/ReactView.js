import React from 'react';
import {Listener} from 'js/helper/Listener';

export class ReactView extends React.Component {
    constructor(props) {
        super(props);

        this.listener = new Listener();
    }

    watchModel(model, events = 'change') {
        this.watch(model, events);
    }

    watchCollection(model, events = 'add remove reset') {
        this.watch(model, events);
    }

    watch(model, events) {
        this.listener.listenTo(model, events, function () {
            this.forceUpdate();
        }.bind(this));
    }

    componentWillUnmount() {
        this.listener.stopListening();
    }
}