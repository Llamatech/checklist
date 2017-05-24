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
                members: []
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
                description: 'Some description',
                owner: 'llama@llama.com',
                members: []
            };
            // console.log(getEmailFromService(Meteor.user().services));

            Meteor.call('group.insert', {group}, function() {
                const result = Groups.find({});
                assert.equal(result.count(), 2);
            });
        });

        it('Should not delete a group if current user differs from its actual owner', function() {
            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.delete', {groupId: group['_id']}, function(err, res) {
                const result = Groups.find({});
                expect(result.count()).to.equal(1);
                assert.equal(err.reason, 'Cannot delete this group because you are not its owner');
            });
        });

        it('Should delete a group', function() {
            var group = {
                name: 'SomeGroup',
                description: 'Some description',
                owner: 'llama@llama.com',
                members: []
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

        it('Should add an user to a group (Owner)', function() {
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
            }

            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.addUser', {groupId: group['_id'], user: user}, function() {
                const result = Groups.find({}).fetch()[0];
                assert.equal(JSON.stringify(user), JSON.stringify(result.members[0]));
            });
        });

        it('Should not add an user to a group (Not Owner)', function() {
            let user = {
                name: 'Llama',
                email: 'llama@llama.com'
            }

            const group = Groups.find({}).fetch()[0];
            Meteor.call('group.addUser', {groupId: group['_id'], user: user}, function(err, res) {
                const result = Groups.find({}).fetch()[0];
                assert.equal(result.members.length, 0);
                assert.equal(err.reason, 'Cannot add an user to this group because you are not its owner');
            });
        });
    });
}