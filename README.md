# co-simple.js

# Coroutines from generator functions

## Current status

[![NPM version](https://img.shields.io/npm/v/co-simple.svg)](https://www.npmjs.com/package/co-simple)
[![Build Status](https://img.shields.io/travis/overlookmotel/co-simple/master.svg)](http://travis-ci.org/overlookmotel/co-simple)
[![Dependency Status](https://img.shields.io/david/overlookmotel/co-simple.svg)](https://david-dm.org/overlookmotel/co-simple)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/co-simple.svg)](https://david-dm.org/overlookmotel/co-simple)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookmotel/co-simple.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/co-simple/master.svg)](https://coveralls.io/r/overlookmotel/co-simple)

## What's it for?

Very simple coroutine wrapper. No cruft, no dependencies, no funny business!

Compatible replacement for `async/await` for versions of Node which don't support async/await natively.

All the other implementations I could find on NPM either include a load of extraneous features, or (unbelievably) are buggy. [co](https://www.npmjs.com/package/co) is great, but includes features which async/await doesn't.

This implementation is identical to the code [babel](https://babeljs.io/) produces when transpiling `async/await`.

So, if you're on a version of Node which doesn't support async/await, you can use this now, and then safely replace `co(function*() {})` with `async function() {}` once you update to a version which supports async/await natively.

## Usage

```js
const co = require('co-simple');

const foo = co( function*(a, b, c) {
	const res = yield Promise.resolve(a * b * c);
	return res;
} );
```

...is identical to...

```js
const foo = async function(a, b, c) {
	const res = await Promise.resolve(a * b * c);
	return res;
};
```

Requires `Promise` to be available in global scope, and support for generator functions (Node 4+).

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/co-simple/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/co-simple/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
