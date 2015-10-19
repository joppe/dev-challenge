import React from 'react';
import {Regex} from 'js/model/Regex';
import {App} from 'js/view/App';

let r = window.r = new Regex();

React.render(
    <App regex={r} />,
    document.body
);