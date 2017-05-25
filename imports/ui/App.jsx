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

        if ( service === 'loginWithTwitter' ) {
            delete options.requestPermissions;
        }

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
            <div>
            <Navib login={this.login.bind(this)}
                   logout={this.logout.bind(this)}/>
                   <br></br>
                   <br></br>
                   <br></br>
                  <div className="container">
                      {console.log(this.props)}
                    {React.cloneElement(this.props.children, { listsOwned: this.props.listsOwned, listsShared: this.props.listsShared, groupsOwned: this.props.groupsOwned, groupsIn:this.props.groupsIn})}
                  </div>
            </div>
        );
    }
}


App.propTypes = {
    listsOwned: PropTypes.array,
    listsShared: PropTypes.array
};

export default createContainer(() => {
        const a = {
        listsOwned: [{
                '_id':1,
                'name': 'Some owned list',
                'description': 'What are you looking at',
                'items': [
                    {
                        '_id':1,
                        'name':'Huevos',
                        'quantity':'12',
                        'assignedTo':'',
                        'completeBefore':'',
                        'priority': 'high',
                        'done': false,
                        'addedBy': 'holi'
                    },
                    {
                        '_id':2,
                        'name':'Mantequilla de maní',
                        'quantity':'12',
                        'assignedTo':'Mamá',
                        'completeBefore':'',
                        'priority': 'high',
                        'done': true,
                        'addedBy': 'holi'
                    }
                ],
                'owner': 'alpaca@alpaca.com',
                'sharedwith': ['cami@google.com','margara@facebook.com'],
                'completed':4,
                'pending':2
            },
            {
                    '_id':2,
                    'name': 'Some other owned list',
                    'description': 'What are you looking at',
                    'items': [],
                    'owner': 'alpaca@alpaca.com',
                    'sharedwith': [],
                    'completed':2,
                    'pending':1
                }],
        listsShared: [{
                '_id':3,
                'name': 'Some random list',
                'description': 'What are you looking at',
                'items': [],
                'owner': 'alpaca@alpaca.com',
                'sharedwith': [],
                'completed':5,
                'pending':6
            }],
        groupsOwned:[{name:"grupo1"},{name:"grupo2"},{name:"grupo3"}],
        groupsIn:[{name:"grupo01"},{name:"grupo02"}]
    };
    return a;
}, App);
