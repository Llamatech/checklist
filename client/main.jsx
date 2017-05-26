import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { browserHistory, Router, Route, IndexRoute } from 'react-router';

import App from '../imports/ui/App.jsx';
import Lists from '../imports/ui/Lists.jsx';
import Landing from '../imports/ui/Landing.jsx'
import Groups from '../imports/ui/Groups.jsx'


Meteor.startup(() => {
  render(<Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Landing} />
      <Route path="lists" component={Lists} />
      <Route path="groups" component={Groups} />
      <Route path="landing" component={Landing} />
    </Route>
  </Router>, document.getElementById('render-target'));
});
