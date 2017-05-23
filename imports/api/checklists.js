/* eslint-disable no-global-assign, no-undef, import/extensions */

import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import ObjectId from 'bson-objectid';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import getEmailFromService from '../../server/methods/users.js';
// import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';

export const Checklists = new Mongo.Collection('checklists');

Checklists.deny({
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

export const insertChecklist = new ValidatedMethod({
    name: 'checklists.insert',
    validate: new SimpleSchema({
        checklist: {
            type: Object
        },
        'checklist.name': {
            type: String
        },
        'checklist.description': {
            type: String,
            optional: true
        },
        'checklist.items': {
            type: Array,
            blackbox: true
        },
        'checklist.owner': {
            type: String
        },
        'checklist.createdAt': {
            type: Date
        },
        'checklist.completeBefore': {
            type: Date,
            optional: true
        },
        'checklist.sharedwith': {
            type: Object,
            blackbox: true
        }
    }).validator(),
    run({checklist}) {
        Checklists.insert(checklist.checklist);
    }
});

export const deleteChecklist = new new ValidatedMethod({
    name: 'checklists.deleteChecklist',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        }
    }).validator(),
    run({checklistId}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.deleteChecklist', 'Cannot delete this checklist because you are not its owner');
        }
        Checklists.remove(checklistId);
    }
});

export const insertItem = new ValidatedMethod({
    name: 'checklists.addItem',
    validate: new SimpleSchema({
        item: {
            type: Object
        },
        'item.checklistId': {
            type: String
        },
        'item.name': {
            type: String
        },
        'item.quantity': {
            type: Number,
            optional: true
        },
        'item.assignedTo': {
            type: Array,
            optional: true
        },
        'item.createdAt': {
            type: Date
        },
        'item.completeBefore': {
            type: Date,
            optional: true
        },
        'item.assignedTo.$': {
            type: Object
        },
        'item.priority': {
            type: Number
        },
        'item.done': {
            type: Boolean
        }
    }).validator(),
    run({item}) {
        const checklist = Checklists.find(item.checklistId).fetch()[0];
        let userFound = false;
        let writePerm = false;
        for(user in checklist.sharedwith) {
            if(user.username === getEmailFromService(Meteor.user().services)) {
                userFound = true;
                writePerm = user.writePerm;
                break;
            }
        }
        if(!userFound || userFound && !writePerm) {
            throw new Meteor.Error('checklists.insertItem', 'Cannot add a new item because you are not authorized to do it');
        }

        Checklists.update(item.checklistId, {
            $push: {
                items: {
                    '_id': ObjectId(),
                    'name': item.name,
                    'quantity': item.quantity,
                    'addedBy': getEmailFromService(Meteor.user().services),
                    'assignedTo': item.assignedTo,
                    'createdAt': item.createdAt,
                    'completeBefore': item.completeBefore,
                    'priority': item.priority,
                    'done': item.done
                }
            }
        });

        return Checklists.find(item.checklistId).fetch()[0].items;
    }
});

export const deleteItem = new ValidatedMethod({
    name: 'checklists.deleteItem',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        itemId: {
            type: ObjectId(),
            blackbox: true
        }
    }).validator(),
    run({checklistId, itemId}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        let userFound = false;
        let writePerm = false;
        for(user in checklist.sharedwith) {
            if(user.username === getEmailFromService(Meteor.user().services)) {
                userFound = true;
                writePerm = user.writePerm;
                break;
            }
        }

        if(!userFound || userFound && !writePerm) {
            throw new Meteor.Error('checklists.deleteItem', 'Cannot delete an item because you are not authorized to do it');
        }

        Checklists.update(checklistId, {
            $pull: {
                items: {
                    '_id': itemId
                }
            }
        });

        return Checklists.find(checklistId).fetch()[0].items;
    }
});

export const updateItemStatus = new ValidatedMethod({
    name: 'checklists.updateItemStatus',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        itemId: {
            type: ObjectId(),
            blackbox: true
        },
        status: {
            type: Boolean
        }
    }).validator(),
    run({checklistId, itemId, status}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        let userFound = false;
        let writePerm = false;
        for(user in checklist.sharedwith) {
            if(user.username === getEmailFromService(Meteor.user().services)) {
                userFound = true;
                writePerm = user.writePerm;
                break;
            }
        }

        if(!userFound || userFound && !writePerm) {
            throw new Meteor.Error('checklists.deleteItem', 'Cannot mark an item as done/not done because you are not authorized to do it');
        }

        Checklists.update({'_id': checklistId, 'items._id': itemId}, {
            $set: {
                'items.$.done': status
            }
        });
    }
});

export const addUser = new ValidatedMethod({
    name: 'checklists.addUser',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        username: {
            type: String
        },
        writePerm: {
            type: Boolean
        }
    }).validator(),
    run({checklistId, username, writePerm}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.addUser', 'Cannot share this checklist with another user because you are not its owner');
        }
        Checklists.update(checklistId, {
            $push: {
                sharedWith: {
                    '_id': ObjectId(),
                    'username': username,
                    'writePerm': writePerm
                }
            }
        });
    }
});

export const removeUser = new ValidatedMethod({
    name: 'checklists.removeUser',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        username: {
            type: String
        }
    }).validator(),
    run({checklistId, username}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.addUser', 'Cannot share this checklist with another user because you are not its owner');
        }
        Checklists.update(checklistId, {
            $pull: {
                sharedWith: {
                    'username': username
                }
            }
        });
    }
});

export const updateUserPermissions = new ValidatedMethod({
    name: 'checklists.removeUser',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        username: {
            type: String
        },
        updateWrite: {
            type: Boolean
        }
    }).validator(),
    run({checklistId, username, updateWrite}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.addUser', 'Cannot update user checklist permissions because you are not its owner');
        }
        Checklists.update({'_id': checklistId, 'sharedWith.username': username}, {
            $set: {
                'sharedWith.$.writePerm': updateWrite
            }
        });
    }
});
