/* eslint-env mocha */

import {Meteor} from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
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
            var someDate = new Date();
            someDate.setDate(someDate.getDate() + 5);
            Checklists.insert({
                'name': 'Some random list',
                'description': 'What are you looking at',
                'completeBefore': someDate,
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
                }],
                'completed': 0,
                'pending': 0
            });

            let item = {
                'name': 'Spam',
                'quantity': 9,
                'createdAt': new Date(),
                'done': false
            };

            // let user1 = {
            //     'name': 'Llama',
            //     'email': 'llama@llama.com',
            //     'writePerm': true
            // };

            // let user2 = {
            //     'name': 'Vicuna',
            //     'email': 'vicuna@vicuna.com',
            //     'writePerm': false
            // }

            let checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item: item});
            // Meteor.call('checklists.addUser', {checklistId: checklist['_id'], user: user1});
            // Meteor.call('checklists.addUser', {checklistId: checklist['_id'], user: user2});

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
            var someDate = new Date();
            someDate.setDate(someDate.getDate() + 5);
            let checklist = {
                'name': 'A super llama list',
                'description': 'Baaaa',
                'completeBefore': someDate
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
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item:item}, function() {
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
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item:item}, function() {
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
            Meteor.call('checklists.addItem', {checklistId: checklist['_id'], item:item}, function() {
                const checklist = Checklists.find({}).fetch()[0];
                assert.equal(checklist.items.length, 1);
            });
        });

        it('Should delete an item (Owner)', function() {
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
            const item = checklist.items[0];

            Meteor.call('checklists.deleteItem', {checklistId: checklist['_id'], itemId: item['_id']}, function(err, res) {
                if(err) {
                    throw new Meteor.Error(err);
                }
                assert.equal(res.length, 0);
            });
        });

        it('Should delete an item (Write permissions)', function() {
            const checklist = Checklists.find({}).fetch()[0];
            const item = checklist.items[0];
            Meteor.call('checklists.deleteItem', {checklistId: checklist['_id'], itemId: item['_id']}, function(err, res) {
                if(err) {
                    throw new Meteor.Error(err);
                }
                assert.equal(res.length, 0);
            });
        });

        it('Should not delete an item (Read permissions)', function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'facebook': {
                            'email': 'vicuna@vicuna.com'
                        }
                    }
                };
            };

            const checklist = Checklists.find({}).fetch()[0];
            const item = checklist.items[0];
            Meteor.call('checklists.deleteItem', {checklistId: checklist['_id'], itemId: item['_id']}, function(err) {
                assert.equal(err.reason, 'Cannot delete an item because you are not authorized to do it');
            });
        });

        it('Should change an item status (Owner)', function() {
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
            const item = checklist.items[0];
            Meteor.call('checklists.updateItemStatus', {checklistId: checklist['_id'], itemId: item['_id'], status: true}, function() {
                const result = Checklists.find({}).fetch()[0];
                assert(result.items[0].done);
            });
        });

        it('Should change an item status (Write permissions)', function() {
            const checklist = Checklists.find({}).fetch()[0];
            const item = checklist.items[0];
            Meteor.call('checklists.updateItemStatus', {checklistId: checklist['_id'], itemId: item['_id'], status: true}, function() {
                const result = Checklists.find({}).fetch()[0];
                assert(result.items[0].done);
            });
        });

        it('Should not change an item status (Read permissions)', function() {
            Meteor.user = function() {
                return {
                    'services': {
                        'facebook': {
                            'email': 'vicuna@vicuna.com'
                        }
                    }
                };
            };

            const checklist = Checklists.find({}).fetch()[0];
            const item = checklist.items[0];
            Meteor.call('checklists.updateItemStatus', {checklistId: checklist['_id'], itemId: item['_id'], status: true}, function(err) {
                assert.equal(err.reason, 'Cannot mark an item as done/not done because you are not authorized to do it');
            });
        });

        it('Should share a list with another user (Owner)', function() {
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
            let user = {
                'name': 'Guanaco',
                'email': 'guanaco@guanaco.com',
                'writePerm': true
            };

            Meteor.call('checklists.addUser', {checklistId: checklist['_id'], user: user}, function() {
                const result = Checklists.find({}).fetch()[0];
                assert.equal(JSON.stringify(result.sharedwith[2]), JSON.stringify(user));
            });
        });

        it('Should not allow to share a list with another user (Not Owner)', function() {
            const checklist = Checklists.find({}).fetch()[0];
            let user = {
                'name': 'Guanaco',
                'email': 'guanaco@guanaco.com',
                'writePerm': true
            };

            Meteor.call('checklists.addUser', {checklistId: checklist['_id'], user: user}, function(err) {
                assert.equal(err.reason, 'Cannot share this checklist with another user because you are not its owner');
            });
        });

        it('Should remove users from a list (Owner)', function() {
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
            let email = 'vicuna@vicuna.com';
            Meteor.call('checklists.removeUser', {checklistId: checklist['_id'], email: email}, function() {
                const result = Checklists.find({}).fetch()[0];
                assert.equal(result.sharedwith.length, 1);
            });
        });

        it('Should not allow to remove users from a list (Not Owner)', function() {
            const checklist = Checklists.find({}).fetch()[0];
            let email = 'vicuna@vicuna.com';
            Meteor.call('checklists.removeUser', {checklistId: checklist['_id'], email: email}, function(err) {
                assert.equal(err.reason, 'Cannot share this checklist with another user because you are not its owner');
            });
        });

        it('Should update user write permissions (Owner)', function() {
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
            let email = 'vicuna@vicuna.com';
            Meteor.call('checklists.updateUserPermissions', {checklistId: checklist['_id'], email: email, updateWrite: true}, function() {
                const result = Checklists.find({}).fetch()[0];
                assert(result.sharedwith[1].writePerm);
            });
        });

        it('Should not allow to update user write permissions (Not Owner)', function() {
            const checklist = Checklists.find({}).fetch()[0];
            let email = 'vicuna@vicuna.com';
            Meteor.call('checklists.updateUserPermissions', {checklistId: checklist['_id'], email: email, updateWrite: true}, function(err) {
                // console.log(err);
                assert.equal(err.reason, 'Cannot update user checklist permissions because you are not its owner');
            });
        });

        it('Should retrieve all user owned lists', function() {
            // let email = getEmailFromService(Meteor.user().services);
            var someDate = new Date();
            someDate.setDate(someDate.getDate() + 5);
            let checklist = {
                'name': 'A super llama list',
                'description': 'Baaaa',
                'completeBefore': someDate
            };

            Meteor.call('checklists.insert', {checklist});

            Meteor.user = function() {
                return {
                    'services': {
                        'google': {
                            'email': 'alpaca@alpaca.com'
                        }
                    }
                };
            };

            // email = getEmailFromService(Meteor.user().services);

            someDate = new Date();
            someDate.setDate(someDate.getDate() + 5);
            let checklist2 = {
                'name': 'A super alpaca list',
                'description': 'Fuerza Peru',
                'completeBefore': someDate
            };

            Meteor.call('checklists.insert', {checklist: checklist2});

            Meteor.call('checklists.getUserOwnedLists', {}, function(err, res) {
                if(err) {
                    throw new Meteor.Error(err);
                }
                assert.equal(res.length, 2);
            });
        });

        it('Should retrieve lists shared with an user', function() {
            // let email = getEmailFromService(Meteor.user().services);
            var someDate = new Date();
            someDate.setDate(someDate.getDate() + 5);
            let checklist = {
                'name': 'A super llama list',
                'description': 'Baaaa',
                'completeBefore': someDate
            };

            let user = {
                'name': 'Guanaco',
                'email': 'guanaco@guanaco.com',
                'writePerm': true
            };

            Meteor.call('checklists.insert', {checklist});
            checklist = Checklists.find({}).fetch()[1];
            Meteor.call('checklists.addUser', {checklistId: checklist['_id'], user: user});

            Meteor.user = function() {
                return {
                    'services': {
                        'google': {
                            'email': 'alpaca@alpaca.com'
                        }
                    }
                };
            };

            checklist = Checklists.find({}).fetch()[0];
            Meteor.call('checklists.addUser', {checklistId: checklist['_id'], user: user});

            Meteor.user = function() {
                return {
                    'services': {
                        'twitter': {
                            'screenName': 'guanaco@guanaco.com'
                        }
                    }
                };
            };

            Meteor.call('checklists.getUserLists', {}, function(err, res) {
                if(err) {
                    throw new Meteor.Error(err);
                }
                assert.equal(res.length, 2);
            });
        });
    });
}