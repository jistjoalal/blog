---
title: "Meteor E2E CI w/ Cypress + Travis-CI"
date: "2019-06-06T01:26:13.957Z"
---

This is a basic guide on setting up end-to-end testing and continuous integration for a Meteor App w/ [Cypress](https://cypress.io) and [Travis](https://travis-ci.com). End-to-end tests are "business logic" tests that ensure a program behaves correctly at the user level. Continuous integration is the practice of automating tests as part of our deployment process. With these two tools, we can push code changes with speed and confidence!

## Prerequisites

- meteor app deployed to heroku

## Install dependencies

```bash
npm i --save-dev cypress start-server-and-test
```

## Configure cypress for meteor

Cypress generates some files (upon first run) that we want to move into the `tests/` dir to avoid publishing w/ Meteor's web server.

```bash
# after running cypress once w/ "cypress run / cypress open"
mv cypress tests/cypress
# edit cypress.json:
{
  "fixturesFolder": "tests/cypress/fixtures",
  "integrationFolder": "tests/cypress/integration",
  "pluginsFile": "tests/cypress/plugins/index.js",
  "screenshotsFolder": "tests/cypress/screenshots",
  "supportFile": "tests/cypress/support/index.js",
  "videosFolder": "tests/cypress/videos",
  "baseUrl": "http://localhost:3000"
}
```

## Basic integration test

Here's an example of a signup test. Cypress is awesome and definitely magical! Built-in timeouts and retries allow us to write our specs to closely mimic actual user behavior. Want to click something that contains the word "Register"? It's practically English.

```js
describe("Signup / Login", () => {
  before(() => {
    // cypress support command (explained below)
    cy.resetDatabase()

    cy.visit("http://localhost:3000/signup")
  })

  it("should signup a new user", () => {
    // submit signup form
    cy.get('input[name="email"]').type("test-user@example.com")
    cy.get('input[name="password"]').type("password")
    cy.get('input[name="cPassword"]').type("password")
    cy.contains("Register").click()
    // should redirect to home page
    cy.url().should("eq", "http://localhost:3000/")

    // user exists and is now logged in
    cy.window().then(win => {
      // this allows accessing the window object within the browser
      const user = win.Meteor.user()
      expect(user).to.exist
      expect(user.emails[0].address).to.equal("test-user@example.com")
    })
  })
})
```

### Reset DB b/w tests

We don't want our tests to be leaving around artifacts that will break later tests. Let's write a cypress support command (helper) to hard reset our database. I've included an optional step of exporting/restoring a DB dump that can serve as a fixtures file. Thanks to [Mark Lynch](https://forums.meteor.com/t/testing-with-cypress/48632/5) on the meteor forums for this awesome trick!

```js
// tests/cypress/support/commands.js
Cypress.Commands.add('resetDatabase', () =>
  cy.exec('mongo mongodb://localhost:3001/meteor --eval "db.dropDatabase()"'),
  // (optional) load in a db dump as fixtures
  // can be generated w/ the following command:
  // > mongodump --port 3001 --out ./tests/cypress/fixtures/test_db
  cy.exec("mongorestore --port 3001 ./tests/cypress/fixtures/test_db");
);

// x.spec.js...
cy.resetDatabase();
```

### Run the tests on a separate DB

To keep the dev environment flexible, we run tests in their own meteor directory, which will create it's own db instance. This can be accomplished by starting meteor with the following command in our test scripts:

```bash
# windows:
set METEOR_LOCAL_DIR=.meteor/test && meteor
# unix:
METEOR_LOCAL_DIR=.meteor/test meteor
```

- Don't forget to add `test` to `.meteor/.gitignore`

## Npm Scripts

```json
"scripts": {
  "start": "meteor",
  "start:e2e": "set METEOR_LOCAL_DIR=.meteor/test && meteor",
  "start:e2e:prod": "METEOR_LOCAL_DIR=.meteor/test meteor --production",
  "cypress:open": "cypress open",
  "cypress:run": "cypress run",
  "test": "start-server-and-test start:e2e http://localhost:3000 cypress:open",
  "test:prod": "start-server-and-test start:e2e:prod http://localhost:3000 cypress:run"
},
```

- `npm run test` for dev testing
  - windows-style env var (METEOR_LOCAL_DIR) for dev on windows
  - runs cypress in GUI
- `npm run test:prod` for ci
  - unix-style env var for unix prod env
  - runs cypress in CLI

**Note**: at this point, these scripts should run in their proper environment

## Travis CI

Travis is configured w/ `.travis.yml`. We specify our staging environments dependencies, how to cache them, what to test, and where to deploy.

```yml
language: node_js
node_js:
  - 8.15.1
cache: npm
directories:
  - "~/.cache"
  - "~/.meteor"
  - ".meteor/local"
before_install:
  - curl https://install.meteor.com | /bin/sh
  - npm install -g cypress
install:
  - npm ci
script:
  - npm run test:prod
deploy:
  provider: heroku
  app: appName
  api_key:
    secure: ######
```

- Node version should match `package.json`
- specify app name ([NAME].herokuapp.com)
- api_key comes from running:

```bash
travis encrypt $(heroku auth:token) --add deploy.api_key
```

install travis cli [here](https://github.com/travis-ci/travis.rb#installation)

### IMPORTANT

- Authorize Travis to access the repo [here](https://travis-ci.com/account/repositories)
- Set env vars @ [travis dashboard](https://travis-ci.com/dashboard) > [project] > settings > environment variables

## Conclusion

If all went well, we now have a continuous integration environment setup for our Meteor App. Overview of what it does:

- Pushing code to the github repo for our project triggers a CI build on travis' staging servers.
- If our cypress test suite passes in the staging environment, the changes are pushed to heroku.
- A cool [badge](https://docs.travis-ci.com/user/status-images/) to tell me how dumb I am today.

## CI video recording (optional)

Cypress has the awesome feature of recording videos of our integration tests. By connecting our CI test runs to the [cypress dashboard](https://dashboard.cypress.io/), we are able to view video playback of them in action!

- Open Cypress Test Runner (the window from `cypress open`)
- Runs tab > Set up Project > Login w/ GitHub > Finish
- Settings tab > Record Key > [copy]
  - this becomes our new `cypress:run` script in `package.json`:
    ```bash
    cypress run --record --key xxxxxx
    ```
- That's it! View the cypress dashboard after CI runs to view their video playback. Here's what a replay looks like:

<video src="https://i.imgur.com/VCfLsAX.mp4" controls></video>
