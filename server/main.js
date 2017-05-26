/* global WebApp, Modules */

import { Meteor } from 'meteor/meteor';
import '../imports/api/checklists.js'
import '../imports/api/groups.js'

Meteor.startup(() => {
  // code to run on server at startup
    WebApp.addHtmlAttributeHook(function() {
        return {
            'lang': 'eng'
        };
    });
    Modules.server.startup();
    // BrowserPolicy.content.allowEval();
});
