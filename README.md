# ucb-cspace-scripts

This package contains Node.js scripts for performing operations such as batch updates on UC Berkeley CollectionSpace installations.

## Installation

Installing the scripts requires git, Node.js (version 8.9 or above), and npm.

Using git:

```
$ git clone https://github.com/ray-lee/ucb-cspace-scripts.js.git
$ cd ucb-cspace-scripts.js
$ npm install
```

## Development & Usage

Compiled scripts are located in the lib/scripts directory. To run a script, use the node executable. For example:

```
$ node lib/scripts/pahma/batchCreateObject.js
```

Source code files for the scripts are located in src/scripts.

The source code may utilize features of JavaScript ES2015, ES2016, and ES2017, as well as [proposed features](https://github.com/tc39/proposals) still being standardized. Some of these language features are not yet natively supported by the JavaScript engine used by Node.js. If you edit the source code for a script, first use [Babel](http://babeljs.io/) to compile the source code to JavaScript that Node.js can run. This can be done using the command:

```
$ npm run build
```

Build output goes to lib/scripts. The files there may then be executed using node:

```
$ node lib/scripts/pahma/batchCreateObject.js
```

Alternatively, the `babel-node` program from the [Babel CLI](https://babeljs.io/docs/usage/cli/) package may be used to compile and execute a script using a single command. Babel CLI is installed as a local dependency of this package (once you've done npm install), so scripts in the src directory can be invoked using the npx executable, as in:

```
$ npx babel-node src/scripts/pahma/batchCreateObject.js
```

## Documentation

The available scripts are described in the [script documentation](./docs/README.md).
