import React, { Component } from 'react';
/* eslint-enable no-unused-vars */

export default class Landing extends Component {
  render() {
    return (
      <div className='container-fluid landing'>
        <div className='text-center row landing-welcome'>
          <h1 className="title">ListHub   </h1>
          <img src="http://duckit.margffoy-tuay.com/static/checklist.svg"></img>
          <br></br>
          <br></br>
          <br></br>
          <p className="about">Welcome to <strong>ListHub!</strong> We want to make your life easier by providing you with the way to share
      your lists. Make a group, add members, make your list and start checking off! ListHub is great for your family grocery lists and
  to keep track of items to buy for parties. Login with your twitter, google, or facebook account to learn more! </p>
        </div>
        <div className='row landing-more'>
        </div>
      </div>
    );
  }
}
