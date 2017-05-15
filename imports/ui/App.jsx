/* eslint-disable no-global-assign, no-undef, import/extensions,
import/no-extraneous-dependencies, meteor/no-session, react/jsx-no-bind,
no-useless-escape, react/forbid-proptypes, no-unused-vars */

import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            'random':1
        };
    }

    render() {
        return (
            <div><h1>ah?</h1></div>
        );
    }
}

export default App;
