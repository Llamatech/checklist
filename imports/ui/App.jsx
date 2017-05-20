/* eslint-disable no-global-assign, no-undef, import/extensions,
import/no-extraneous-dependencies, meteor/no-session, react/jsx-no-bind,
no-useless-escape, react/forbid-proptypes, no-unused-vars */

import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import Navib from './navbar.jsx';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            'random': 1,
            'user': {
                'name': 'Guest',
                'email': null
            }
        };
    }

    componentDidMount() {
        Meteor.call('getUserData', (err, res) => {
            if (!err) {
                this.setState({user: res});
            }
        });
    }

    login(service) {
        console.log(service);
        const options = {
            requestPermissions: ['email']
        };
        Meteor[service](options, (err) => {
            const user = Meteor.user();
            console.log(user);
            this.setState({user: user});
        });
    }

    logout() {
        Meteor.logout(() => {
            this.setState({
                user: {
                    username: 'Guest',
                    'email': null
                }
            });
        });
    }

    render() {
        return (
            <Navib login={this.login.bind(this)}
                   logout={this.logout.bind(this)}/>
        );
    }
}

export default App;
