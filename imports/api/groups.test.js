/* eslint-env mocha */

import {Meteor} from 'meteor/meteor';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import {Groups} from './groups.js';
import getEmailFromService from '../../server/methods/users.js';

if(Meteor.server)
{
    Meteor.user = function() {
        return {
            'services': {
                'facebook': {
                    'email': 'llama@llama.com'
                }
            }
        };
    };

    describe('Groups', function() {
        beforeEach(function() {
            Groups.remove({});
            Groups.insert({
                name: 'DefaultGroup',
                description: 'You shouldn\'t be looking at this',
                owner: 'alpaca@alpaca.com',
                members: [{'name': 'Vicuna', 'email': 'vicuna@vicuna.com'}]
            });
            Meteor.user = function() {
                return {
                    'services': {
                        'facebook': {
                            'email': 'llama@llama.com'
                        }
                    }
                };
            };
        });

        it('Should create a group', function() {
            var group = {
                name: 'SomeGroup',
                description: 'Some description'
                // owner: 'llama@llama.com',
                // members: []
            };
            // console.log(getEmailFromService(Meteor.user().services));

            Meteor.call('group.insert', {group}, function() {
                const result = Groups.find({});
                assert.equal(result.count(), 2);
            });
        });

        it('Should not delete a group (Not Owner)', function() {
            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.delete', {groupId: group['_id']}, function(err) {
                const result = Groups.find({});
                expect(result.count()).to.equal(1);
                assert.equal(err.reason, 'Cannot delete this group because you are not its owner');
            });
        });

        it('Should delete a group', function() {
            var group = {
                name: 'SomeGroup',
                description: 'Some description'
                // owner: 'llama@llama.com',
                // members: []
            };

            Meteor.call('group.insert', {group}, function() {
                const result = Groups.find({
                    'owner': getEmailFromService(Meteor.user().services)
                }).fetch()[0];
                Meteor.call('group.delete', {groupId: result['_id']}, function() {
                    const totalGroups = Groups.find({}).count();
                    assert.equal(totalGroups, 1);
                });
            });
        });

        it('Should add an user to a group', function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'facebook': {
                            'email': 'alpaca@alpaca.com'
                        }
                    }
                };
            };

            let user = {
                name: 'Llama',
                email: 'llama@llama.com'
            };

            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.addUser', {groupId: group['_id'], user: user}, function() {
                const result = Groups.find({}).fetch()[0];
                assert.equal(JSON.stringify(user), JSON.stringify(result.members[1]));
            });
        });

        it('Should not add an user to a group (Not Owner)', function() {
            let user = {
                name: 'Llama',
                email: 'llama@llama.com'
            };

            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.addUser', {groupId: group['_id'], user: user}, function(err) {
                const result = Groups.find({}).fetch()[0];
                assert.equal(result.members.length, 1);
                assert.equal(err.reason, 'Cannot add an user to this group because you are not its owner');
            });
        });

        it('Should delete a user from a group', function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'facebook': {
                            'email': 'alpaca@alpaca.com'
                        }
                    }
                };
            };

            let userEmail = 'vicuna@vicuna.com';
            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.deleteUser', {groupId: group['_id'], 'userEmail': userEmail}, function() {
                const result = Groups.find({}).fetch()[0];
                assert.equal(result.members.length, 0);
            });
        });

        it('Should not delete a user from a group (Not Owner)', function() {
            let userEmail = 'vicuna@vicuna.com';
            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.deleteUser', {groupId: group['_id'], 'userEmail': userEmail}, function(err) {
                const result = Groups.find({}).fetch()[0];
                assert.equal(result.members.length, 1);
                assert.equal(err.reason, 'Cannot delete user from this group because you are not its owner');
            });
        });

        it('Should retrieve all user owned groups', function() {
            var group1 = {
                name: 'SomeGroup',
                description: 'Some description'
                // owner: 'llama@llama.com',
                // members: []
            };

            var group2 = {
                name: 'AnotherGroup',
                description: 'Some description'
                // owner: 'llama@llama.com',
                // members: []
            };

            Meteor.call('group.insert', {group: group1});
            Meteor.call('group.insert', {group: group2});

            Meteor.call('group.getOwnedGroups', {}, function(err, res) {
                if(err) {
                    throw new Meteor.Error(err);
                }
                assert.equal(res.length, 2);
            });
        });

        it('Should retrieve groups that a user belongs in', function() {
            var group1 = {
                name: 'SomeGroup',
                description: 'Some description'
                // owner: 'llama@llama.com',
                // members: [{'name': 'Vicuna', 'email': 'vicuna@vicuna.com'}]
            };

            var user = {
                'name': 'Vicuna',
                'email': 'vicuna@vicuna.com'
            };

            var group2 = {
                name: 'AnotherGroup',
                description: 'Some description'
                // owner: 'llama@llama.com',
                // members: []
            };

            Meteor.call('group.insert', {group: group1});
            let group = Groups.find({}).fetch()[1];
            Meteor.call('group.addUser', {groupId: group['_id'], user: user});

            Meteor.call('group.insert', {group: group2});

            Meteor.user = function() {
                return {
                    'services': {
                        'facebook': {
                            'email': 'vicuna@vicuna.com'
                        }
                    }
                };
            };

            Meteor.call('group.getUserGroups', {}, function(err, res) {
                if(err) {
                    throw new Meteor.Error(err);
                }
                assert.equal(res.length, 2);
            });

        });
    });
}