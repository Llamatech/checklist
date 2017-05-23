/* eslint-env mocha */

import {Meteor} from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import {Groups} from './groups.js';

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
                owner: 'llama2@llama.com',
                members: []
            });
        });

        it('Should create a group', function() {
            var group = {
                name: 'SomeGroup',
                description: 'Some description',
                owner: 'llama@llama.com',
                members: []
            };

            Meteor.call('group.insert', {group}, function() {
                const result = Groups.find({});
                assert.equal(result.count(), 2);
            });
        });
    });
}