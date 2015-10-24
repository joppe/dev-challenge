import React from 'react';
import {Regex} from 'js/model/Regex.js';
import {App} from 'js/view/App.js';

let r = window.r = new Regex();

React.render(
    <App regex={r} />,
    document.body
);