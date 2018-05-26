# fms-admin-client

A client designed to provide a framework for interactions with FileMaker Server Admin Tools.

For in depth documentation head to the [`docs`](https://luidog.github.io/fms-admin-client)

## Installation

This is a [Node.js](https://nodejs.org/) module available through the
[npm registry](https://www.npmjs.com/). It can be installed using the
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or
[`yarn`](https://yarnpkg.com/en/)
command line tools.

```sh
npm install fms-admin-client --save
```

## Tests

```sh
npm install
npm test
```

```
> fms-admin-client@0.0.1 test /fms-admin-client
> nyc _mocha --recursive ./tests --timeout=30000
  Clone Capabilities
    ✓ should clone a file to a temp directory (1177ms)
  Service Capabilities
    ✓ should throw an error if the service is already running (136ms)
    ✓ should stop the service (12605ms)
    ✓ should throw an error if the service is not running (1170ms)
    ✓ should start the service (1587ms)
  Storage
    ✓ should allow an instance to be created
    ✓ should allow an instance to be saved.
    ✓ should allow an instance to be recalled
    ✓ should allow insances to be listed
    ✓ should allow you to remove an instance
  10 passing (17s)
-----------------------|----------|----------|----------|----------|-------------------|
File                   |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------|----------|----------|----------|----------|-------------------|
All files              |    86.96 |       50 |    74.29 |    89.39 |                   |
 fms-admin-client      |      100 |      100 |      100 |      100 |                   |
  index.js             |      100 |      100 |      100 |      100 |                   |
 fms-admin-client/src  |    86.57 |       50 |    74.29 |    89.06 |                   |
  admin.model.js       |    95.24 |      100 |       90 |       95 |                73 |
  cli.model.js         |       80 |       50 |    66.67 |    84.21 |... ,48,52,100,133 |
  credentials.model.js |      100 |      100 |      100 |      100 |                   |
  index.js             |      100 |      100 |      100 |      100 |                   |
-----------------------|----------|----------|----------|----------|-------------------|
```

## Dependencies

* [child-process-promise](https://ghub.io/child-process-promise): Simple wrapper around the &quot;child_process&quot; module that makes use of promises
* [lodash](https://ghub.io/lodash): Lodash modular utilities.
* [marpat](https://ghub.io/marpat): A class-based ES6 ODM for Mongo-like databases.
* [string-to-stream](https://ghub.io/string-to-stream): Convert a string into a stream (streams2)

## Dev Dependencies

* [chai](https://ghub.io/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
* [chai-as-promised](https://ghub.io/chai-as-promised): Extends Chai with assertions about promises.
* [colors](https://ghub.io/colors): get colors in your node.js console
* [coveralls](https://ghub.io/coveralls): takes json-cov output into stdin and POSTs to coveralls.io
* [dotenv](https://ghub.io/dotenv): Loads environment variables from .env file
* [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
* [eslint-config-google](https://ghub.io/eslint-config-google): ESLint shareable config for the Google style
* [eslint-config-prettier](https://ghub.io/eslint-config-prettier): Turns off all rules that are unnecessary or might conflict with Prettier.
* [eslint-plugin-prettier](https://ghub.io/eslint-plugin-prettier): Runs prettier as an eslint rule
* [fs-extra](https://ghub.io/fs-extra): fs-extra contains methods that aren&#39;t included in the vanilla Node.js fs package. Such as mkdir -p, cp -r, and rm -rf.
* [jsdocs](https://ghub.io/jsdocs): jsdocs
* [minami](https://ghub.io/minami): Clean and minimal JSDoc 3 Template / Theme
* [mocha](https://ghub.io/mocha): simple, flexible, fun test framework
* [mocha-lcov-reporter](https://ghub.io/mocha-lcov-reporter): LCOV reporter for Mocha
* [nyc](https://ghub.io/nyc): the Istanbul command line interface
* [package-json-to-readme](https://ghub.io/package-json-to-readme): Generate a README.md from package.json contents
* [prettier](https://ghub.io/prettier): Prettier is an opinionated code formatter
* [varium](https://ghub.io/varium): A strict parser and validator of environment config variables

## License

MIT
