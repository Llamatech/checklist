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
            type: Array
        },
        'checklist.items.$' : {
            type: Object,
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
            type: Array
        },
        'checklist.sharedwith.$': {
            type: Object,
            blackbox: true
        },
        'checklist.pending': {
            type: Number
        },
        'checklist.completed': {
            type: Number
        }
    }).validator(),
    run({checklist}) {
        Checklists.insert(checklist);
    }
});

export const deleteChecklist = new ValidatedMethod({
    name: 'checklists.delete',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        }
    }).validator(),
    run({checklistId}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.delete', 'Cannot delete this checklist because you are not its owner');
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
        'checklistId': {
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
            type: Object,
            blackbox: true
        },
        'item.priority': {
            type: Number,
            optional: true
        },
        'item.done': {
            type: Boolean
        }
    }).validator(),
    run({checklistId, item}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        let userFound = checklist.owner === getEmailFromService(Meteor.user().services);
        let writePerm = checklist.owner === getEmailFromService(Meteor.user().services);
        if(!writePerm) {
            for(var i = 0; i < checklist.sharedwith.length; i++) {
                var user = checklist.sharedwith[i];
                if(user.email === getEmailFromService(Meteor.user().services)) {
                    userFound = true;
                    writePerm = user.writePerm;
                    break;
                }
            }
        }
        if(!userFound || (userFound && !writePerm)) {
            throw new Meteor.Error('checklists.insertItem', 'Cannot add a new item because you are not authorized to do it');
        }

        Checklists.update(checklistId, {
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

        let increase = Number(item.done);
        let totalPending = checklist.pending + (1 - increase);
        let totalCompleted = checklist + increase;

        Checklists.update(checklistId, {
            $set: {
                'pending': totalPending,
                'completed': totalCompleted
            }
        });

        return Checklists.find(checklistId).fetch()[0].items;
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
        let userFound = checklist.owner === getEmailFromService(Meteor.user().services);
        let writePerm = checklist.owner === getEmailFromService(Meteor.user().services);
        if(!writePerm) {
            for(var i = 0; i < checklist.sharedwith.length; i++) {
                var user = checklist.sharedwith[i];
                if(user.email === getEmailFromService(Meteor.user().services)) {
                    userFound = true;
                    writePerm = user.writePerm;
                    break;
                }
            }
        }
        if(!userFound || (userFound && !writePerm)) {
            throw new Meteor.Error('checklists.deleteItem', 'Cannot delete an item because you are not authorized to do it');
        }

        let checkItem = Checklists.find(checklistId, {
            items: {
                $elemMatch: {
                    '_id': itemId
                }
            }
        }).fetch()[0].items[0];

        let decrease = Number(checkItem.done);
        let pendingUpdate = checklist.pending - (1 - decrease);
        let completedUpdate = checklist.completed - decrease;

        Checklists.update(checklistId, {
            $pull: {
                items: {
                    '_id': itemId
                }
            }
        });

        Checklists.update(checklistId, {
            $set: {
                'pending': pendingUpdate,
                'completed': completedUpdate
            }
        });

        // console.log(Checklists.find(checklistId).fetch()[0]);
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
        let userFound = checklist.owner === getEmailFromService(Meteor.user().services);
        let writePerm = checklist.owner === getEmailFromService(Meteor.user().services);
        if(!writePerm) {
            for(var i = 0; i < checklist.sharedwith.length; i++) {
                var user = checklist.sharedwith[i];
                if(user.email === getEmailFromService(Meteor.user().services)) {
                    userFound = true;
                    writePerm = user.writePerm;
                    break;
                }
            }
        }

        if(!userFound || userFound && !writePerm) {
            throw new Meteor.Error('checklists.updateItemStatus', 'Cannot mark an item as done/not done because you are not authorized to do it');
        }

        let update = Number(status);
        let pendingUpdate = checklist.pending + (1 - update);
        let completedUpdate = checklist.completed + update;

        Checklists.update({'_id': checklistId, 'items._id': itemId}, {
            $set: {
                'items.$.done': status
            }
        });

        Checklists.update(checklistId, {
            $set: {
                'pending': pendingUpdate,
                'completed': completedUpdate
            }
        });

        return Checklists.find(checklistId).fetch()[0].items;
    }
});

export const addUser = new ValidatedMethod({
    name: 'checklists.addUser',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        user: {
            type: Object
        },
        'user.email': {
            type: String
        },
        'user.name': {
            type: String
        },
        'user.writePerm': {
            type: Boolean
        }
    }).validator(),
    run({checklistId, user}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.addUser', 'Cannot share this checklist with another user because you are not its owner');
        }
        Checklists.update(checklistId, {
            $push: {
                sharedwith: user
            }
        });

        return Checklists.find(checklistId).fetch()[0].sharedwith;
    }
});

export const removeUser = new ValidatedMethod({
    name: 'checklists.removeUser',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        email: {
            type: String
        }
    }).validator(),
    run({checklistId, email}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.addUser', 'Cannot share this checklist with another user because you are not its owner');
        }
        Checklists.update(checklistId, {
            $pull: {
                sharedwith: {
                    'email': email
                }
            }
        });

        return Checklists.find(checklistId).fetch()[0].sharedwith;
    }
});

export const updateUserPermissions = new ValidatedMethod({
    name: 'checklists.updateUserPermissions',
    validate: new SimpleSchema({
        checklistId: {
            type: String
        },
        email: {
            type: String
        },
        updateWrite: {
            type: Boolean
        }
    }).validator(),
    run({checklistId, email, updateWrite}) {
        const checklist = Checklists.find(checklistId).fetch()[0];
        if(checklist.owner !== getEmailFromService(Meteor.user().services))
        {
            throw new Meteor.Error('checklists.addUser', 'Cannot update user checklist permissions because you are not its owner');
        }
        Checklists.update({'_id': checklistId, 'sharedwith.email': email}, {
            $set: {
                'sharedwith.$.writePerm': updateWrite
            }
        });
    }
});

export const getUserOwnedChecklists = new ValidatedMethod({
    name: 'checklists.getUserOwnedLists',
    validate: new SimpleSchema({}).validator(),
    run() {
        let email = getEmailFromService(Meteor.user().services);

        return Checklists.find({
            owner: email
        }).fetch();
    }
});

export const getUserLists = new ValidatedMethod({
    name: 'checklists.getUserLists',
    validate: new SimpleSchema({}).validator(),
    run() {
        let email = getEmailFromService(Meteor.user().services);

        return Checklists.find({
            sharedwith: {
                $elemMatch: {
                    email: email
                }
            }
        }).fetch();
    }
});