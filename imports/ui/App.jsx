/* eslint-disable no-global-assign, no-undef, import/extensions,
import/no-extraneous-dependencies, meteor/no-session, react/jsx-no-bind,
no-useless-escape, react/forbid-proptypes, no-unused-vars */

import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import Navib from './navbar.jsx';
import Landing from './Landing.jsx'
import {Checklists} from '../api/checklists.js';
import {Groups} from '../api/groups.js';

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
                  {Meteor.user()?
                          <div className="container">
                              {React.cloneElement(this.props.children, { listsOwned: this.props.listsOwned, listsShared: this.props.listsShared, groupsOwned: this.props.groupsOwned, groupsIn:this.props.groupsIn})}
                          </div>
                        :
                        <div className="container">
                          <Landing/>
                        </div>
                    }
                </div>


        );
    }
}


App.propTypes = {
    listsOwned: PropTypes.array,
    listsShared: PropTypes.array
};

export default createContainer(() => {
    // Meteor.call('checklists.getUserLists',{}, (err, lu)=>{
    //     console.log(err)
    //     console.log(lu)
    //      Meteor.call('checklists.getUserOwnedLists',{},(eerr, lo)=>{
    //          console.log(eerr)
    //          console.log(lo)
    //          const a = {
    //              listsOwned: lu,
    //              listsShared: lo
    //          };
    //          console.log(a);
    //      return a;
    //      })
    // })

    if(!Meteor.user()){
        console.log("nonas")
        return {
            listsOwned:[],
        listsShared:[],
        groupsOwned: [],
        groupsIn: []
    };
    }
    else{
        console.log('sisas')
    let user = Meteor.users.findOne({_id: Meteor.userId()});
    let emails   = user.emails,
        services = user.services;
    let emailsito = null;
    if ( emails ) {
        emailsito= emails[ 0 ].address;
    } else if ( services ) {
        for ( let service in services ) {
            let current = services[ service ];
            emailsito= service === 'twitter' ? current.screenName : current.email;
        }
    } else {
        emailsito= user.profile.name;
    }
    console.log(emailsito)



    return {
        listsOwned:Checklists.find({
        owner: emailsito
    }).fetch(),
    listsShared:Checklists.find({
        sharedwith: {
                $elemMatch: {
                    email: emailsito
                }
            }
    }).fetch().filter((obj)=>{
        if (obj.owner===emailsito){
            return false;
        }
        return true;
    }),
    groupsOwned: Groups.find({
        owner: emailsito
    }).fetch(),
    groupsIn: Groups.find(
        {
        members: {
            $elemMatch: {
                email: emailsito
            }
        }
    }).fetch().filter((obj)=>{
        if (obj.owner===emailsito){
            return false;
        }
        return true;
    })
};

}





}, App);
