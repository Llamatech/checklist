# ListHub
A simple and collaborative checklist for items that must be accomplished/buyed

## Project info
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Build status
[![CircleCI](https://circleci.com/gh/Llamatech/listify.svg?style=svg)](https://circleci.com/gh/Llamatech/listify)
[![Coverage Status](https://coveralls.io/repos/github/Llamatech/listify/badge.svg?branch=master)](https://coveralls.io/github/Llamatech/listify?branch=master)
[![dependencies Status](https://david-dm.org/Llamatech/listify/status.svg)](https://david-dm.org/Llamatech/listify)

## Settings and configurations
This app depends on Facebook, Google and Twitter API integration, which includes OAuth authentication, this means that to use this app, you must
generate an OAuth API key per each service. Then it is essential to create a ``settings-development.json``
file, which should look like this:
```json
{
  "public": {},
  "private": {
    "oAuth": {
      "facebook": {
        "appId": "<Your App ID>",
        "secret": "<Your App secret>"
      },
      "github": {
        "clientId": "",
        "secret": ""
      },
      "google": {
        "clientId": "<Your Client ID>",
        "secret": "<Your Client Secret>"
      },
      "twitter": {
        "consumerKey": "<Your Consumer Key>",
        "secret": "<Your consumer secret>"
      }
    }
  }
}
```
The callback url should be declared as ``http://localhost:3000`` - ``http://127.0.0.1:3000``

## Deploying and installation
To deploy this application, you need to install meteor and node.js. After satisfying both requierements, please execute:
```
meteor npm install
npm run
```
See it in action at: http://localhost:3000

## Screenshot and sample image
![alt tag](https://68.media.tumblr.com/4c966908939ea605f78cb0ea6041b5a5/tumblr_oqjvf7lbXf1tsf799o1_1280.png)

## Demo video
See a demo of the app here: https://youtu.be/nQBC7rRq__g
