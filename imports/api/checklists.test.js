/* eslint-env mocha */

import {Meteor} from 'meteor/meteor';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import {Checklists} from './checklists.js';
import getEmailFromService from '../../server/methods/users.js';

if(Meteor.server)
{
    Meteor.user = function() {
        return {
            'services': {
                'google': {
                    'email': 'alpaca@alpaca.com'
                }
            }
        };
    };

    describe('Checklists', function() {
        beforeEach(function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'google': {
                            'email': 'alpaca@alpaca.com'
                        }
                    }
                };
            };
            Checklists.remove({});
            Checklists.insert({
                'name': 'Some random list',
                'description': 'What are you looking at',
                'items': [],
                'owner': 'alpaca@alpaca.com',
                'createdAt': new Date(),
                'sharedwith': [{
                    'name': 'Llama',
                    'email': 'llama@llama.com',
                    'writePerm': true
                },
                {
                    'name': 'Vicuna',
                    'email': 'vicuna@vicuna.com',
                    'writePerm': false
                }]
            });

            let item = {
                'name': 'Spam',
                'quantity': 9,
                'createdAt': new Date(),
                'done': false
            };

            let checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item: item});

            Meteor.user = function() {
                return {
                    'services': {
                        'twitter': {
                            'screenName': 'llama@llama.com'
                        }
                    }
                };
            };

        });

        it('Should create a new checklist', function() {
            let email = getEmailFromService(Meteor.user().services);
            let checklist = {
                'name': 'A super llama list',
                'description': 'Baaaa',
                'items': [],
                'owner': email,
                'createdAt': new Date(),
                'sharedwith': []
            };

            Meteor.call('checklists.insert', {checklist}, function() {
                const result = Checklists.find({'owner': email}).fetch()[0];
                assert.equal(checklist.name, result.name);
            });
        });

        it('Should delete a checklist', function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'google': {
                            'email': 'alpaca@alpaca.com'
                        }
                    }
                };
            };

            const checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.delete', {checklistId: checklist['_id']}, function() {
                const result = Checklists.find({});
                assert.equal(result.count(), 0);
            });
        });

        it('Should not delete a checklist (Not Owner)', function() {
            const checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.delete', {checklistId: checklist['_id']}, function(err) {
                const result = Checklists.find({});
                assert.equal(result.count(), 1);
                assert.equal(err.reason, 'Cannot delete this checklist because you are not its owner');
            });
        });

        it('Should add an item to a list (Owner)', function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'google': {
                            'email': 'alpaca@alpaca.com'
                        }
                    }
                };
            };

            let item = {
                'name': 'Ham',
                'quantity': 12,
                'createdAt': new Date(),
                'done': false
            };

            const checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item:item}, function(err) {
                const checklist = Checklists.find({}).fetch()[0];
                assert.equal(checklist.items.length, 2);
            });
        });

        it('Should add an item to a list (Write permissions)', function() {
            let item = {
                'name': 'Ham',
                'quantity': 12,
                'createdAt': new Date(),
                'done': false
            };

            const checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item:item}, function(err) {
                const checklist = Checklists.find({}).fetch()[0];
                assert.equal(checklist.items.length, 2);
            });
        });

        it('Should not add an item to a list (Read permissions)', function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'facebook': {
                            'email': 'vicuna@vicuna.com'
                        }
                    }
                };
            };

            let item = {
                'name': 'Eggs',
                'quantity': 8,
                'createdAt': new Date(),
                'done': false
            };

            const checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item:item}, function(err) {
                const checklist = Checklists.find({}).fetch()[0];
                assert.equal(checklist.items.length, 1);
            });
        });
    });


}