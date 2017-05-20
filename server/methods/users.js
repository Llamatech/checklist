/* global Meteor */

const _getEmailFromService = ( services ) => {
    for ( let service in services ) {
        let current = services[ service ];
        return service === 'twitter' ? current.screenName : current.email;
    }
};

Meteor.methods({
    'getUserData': () => {
    // console.log("Ah?");
    // console.log(Meteor.userId());
        return Meteor.users.findOne({_id:Meteor.userId()});
    },
    'getUserEmail': () => {
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        let emails   = user.emails,
            services = user.services;

        if ( emails ) {
            return emails[ 0 ].address;
        } else if ( services ) {
            return _getEmailFromService( services );
        } else {
            return user.profile.name;
        }
    }
});


