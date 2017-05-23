/* eslint-disable no-global-assign, no-undef, import/extensions */

import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import getEmailFromService from '../../server/methods/users.js';

export const Groups = new Mongo.Collection('groups');

Groups.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});

export const insertGroup = new ValidatedMethod({
    name: 'group.insert',
    validate: new SimpleSchema({
        group: {
            type: Object
        },
        'group.name': {
            type: String
        },
        'group.description': {
            type: String,
            optional: true
        },
        'group.members': {
            type: Array
        },
        'group.members.$': {
            type: Object,
            blackbox: true
        },
        'group.owner': {
            type: String
        }
    }).validator(),
    run({group}) {
        Groups.insert(group);
    }
});

export const deleteGroup = new ValidatedMethod({
    name: 'group.delete',
    validate: new SimpleSchema({
        groupId: {
            type: String
        }
    }).validator(),
    run({groupId}) {
        let email = getEmailFromService(Meteor.user().services);
        let group = Groups.find(groupId).fetch()[0];
        if(group.owner !== email) {
            throw new Meteor.Error('group.delete', 'Cannot delete this group because you are not its owner');
        }
        Groups.remove(groupId);
    }
});

export const addUserGroup = new ValidatedMethod({
    name: 'group.addUser',
    validate: new SimpleSchema({
        groupId: {
            type: String
        },
        user: {
            type: Object
        },
        'user.name': {
            type: String
        },
        'user.email': {
            type: String
        }
    }).validator(),
    run({groupId, user}) {
        let email = getEmailFromService(Meteor.user().services);
        let group = Groups.find(groupId).fetch()[0];
        if(group.owner !== email) {
            throw new Meteor.Error('group.addUser', 'Cannot add an user to this group because you are not its owner');
        }
        Groups.update(groupId, {
            $push: {
                members: user
            }
        });
    }
});

export const deleteUserGroup = new ValidatedMethod({
    name: 'group.deleteUser',
    validate: new SimpleSchema({
        groupId: {
            type: String
        },
        userEmail: {
            type: String
        }
    }).validator(),
    run({groupId, userEmail}) {
        let email = getEmailFromService(Meteor.user().services);
        let group = Groups.find(groupId).fetch()[0];
        if(group.owner !== email) {
            throw new Meteor.Error('group.deleteUser', 'Cannot delete user from this group because you are not its owner');
        }
        Groups.update(groupId, {
            $pull: {
                members: {
                    'email': userEmail
                }
            }
        });
    }
});