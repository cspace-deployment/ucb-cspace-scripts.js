# ucb-cspace-scripts

This package contains Node.js scripts for performing operations such as batch updates on UC Berkeley CollectionSpace installations.

## Installation

Installing the scripts requires git, Node.js, and npm.

Using git:

```
$ git clone https://github.com/ray-lee/ucb-cspace-scripts.js.git
$ cd ucb-cspace-scripts.js
$ npm install
```

## Development & Usage

Source code files for the scripts are located in src/scripts.

The source code may utilize features of JavaScript [ES2015](https://github.com/lukehoban/es6features#readme) and ES2016, as well as some [proposed features](https://github.com/tc39/proposals) still being standardized. Some of these language features are not yet natively supported by the JavaScript engine used by Node.js. To run a script, first use [Babel](http://babeljs.io/) to compile the source code to JavaScript that Node.js can run. This can be done using the command:

```
$ npm run build
```

Build output goes to lib/scripts. The files there may be executed using node:

```
$ node lib/scripts/pahma/batchCreateObject.js
```

Alternatively, the `babel-node` program from the [Babel CLI](https://babeljs.io/docs/usage/cli/) package may be used to compile and execute a script using a single command. Babel CLI is installed as a local dependency of this package (once you've done npm install), so scripts in the src directory can be invoked as:

```
$ ./node_modules/.bin/babel-node src/scripts/pahma/batchCreateObject.js
```
