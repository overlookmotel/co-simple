/* --------------------
 * co-simple module
 * Tests
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	{expect} = chai,
	chaiAsPromised = require('chai-as-promised'),
	co = require('../lib/');

// Init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// Tests

/* jshint expr: true */
/* global describe, it */

describe('co', function() {
	it('returns a function', function() {
		const fn = co(function*() {}); // jshint ignore:line
		expect(fn).to.be.a('function');
	});

	it('passes arguments to generator function', function() {
		const arg1 = {a: 1}, arg2 = {b: 2};
		let calledArgs;
		const fn = co(function*() {
			calledArgs = Array.prototype.slice.call(arguments);
		}); // jshint ignore:line
		const p = fn(arg1, arg2);
		expect(calledArgs).to.have.length(2);
		expect(calledArgs[0]).to.equal(arg1);
		expect(calledArgs[1]).to.equal(arg2);
		return p;
	});

	it('passes context to generator function', function() {
		const ctx = {c: 3};
		let calledCtx;
		const fn = co(function*() {
			calledCtx = this;
		}); // jshint ignore:line
		const p = fn.call(ctx);
		expect(calledCtx).to.equal(ctx);
		return p;
	});
});

describe('returned function', function() {
	it('calls generator function synchronously', function() {
		let called = false;
		const fn = co(function*() {
			called = true;
		}); // jshint ignore:line
		const p = fn();
		expect(called).to.be.true;
		return p;
	});

	it('returns a promise', function() {
		const fn = co(function*() {}); // jshint ignore:line
		const p = fn();
		expect(p).to.be.instanceof(Promise);
		return p;
	});

	describe('returns promise resolving to plain return value of generator function', function() {
		it('with no yield statements', function() {
			const ret = {a: 123};
			const fn = co(function*() {
				return ret;
			}); // jshint ignore:line
			const p = fn();
			return expect(p).to.eventually.equal(ret);
		});

		it('with 1 yield statement', function() {
			const ret = {a: 123};
			const fn = co(function*() {
				yield Promise.resolve(1);
				return ret;
			});
			const p = fn();
			return expect(p).to.eventually.equal(ret);
		});

		it('with 2 yield statements', function() {
			const ret = {a: 123};
			const fn = co(function*() {
				yield Promise.resolve(1);
				yield Promise.resolve(1);
				return ret;
			});
			const p = fn();
			return expect(p).to.eventually.equal(ret);
		});
	});

	describe('returns promise resolving to resolved value of promise returned from generator function', function() {
		it('with no yield statements', function() {
			const ret = {a: 123};
			const fn = co(function*() {
				return Promise.resolve(ret);
			}); // jshint ignore:line
			const p = fn();
			return expect(p).to.eventually.equal(ret);
		});

		it('with 1 yield statement', function() {
			const ret = {a: 123};
			const fn = co(function*() {
				yield Promise.resolve(1);
				return Promise.resolve(ret);
			});
			const p = fn();
			return expect(p).to.eventually.equal(ret);
		});

		it('with 2 yield statements', function() {
			const ret = {a: 123};
			const fn = co(function*() {
				yield Promise.resolve(1);
				yield Promise.resolve(1);
				return Promise.resolve(ret);
			});
			const p = fn();
			return expect(p).to.eventually.equal(ret);
		});
	});

	describe('rejects promise if error thrown in generator function', function() {
		it('before any yield statements', function() {
			const err = new Error('boo!');
			const fn = co(function*() {
				throw err;
			}); // jshint ignore:line
			const p = fn();
			return expect(p).to.be.rejectedWith(err);
		});

		it('after 1 yield statement', function() {
			const err = new Error('boo!');
			const fn = co(function*() {
				yield Promise.resolve(1);
				throw err;
			});
			const p = fn();
			return expect(p).to.be.rejectedWith(err);
		});

		it('after 2 yield statements', function() {
			const err = new Error('boo!');
			const fn = co(function*() {
				yield Promise.resolve(1);
				yield Promise.resolve(1);
				throw err;
			});
			const p = fn();
			return expect(p).to.be.rejectedWith(err);
		});
	});

	describe('awaits on yield', function() {
		it('when yield promise', function() {
			let called = false;
			const fn = co(function*() {
				yield Promise.resolve(1);
				called = true;
			});
			const p = fn();
			expect(called).to.be.false;
			return p.then(() => {
				expect(called).to.be.true;
			});
		});

		it('when yield plain value', function() {
			let called = false;
			const fn = co(function*() {
				yield 123;
				called = true;
			});
			const p = fn();
			expect(called).to.be.false;
			return p.then(() => {
				expect(called).to.be.true;
			});
		});
	});

	describe('yield returns value', function() {
		it('when yield promise', function() {
			const val = {d: 4};
			let yielded;
			const fn = co(function*() {
				yielded = yield Promise.resolve(val);
			});
			const p = fn();
			return p.then(() => {
				expect(yielded).to.equal(val);
			});
		});

		it('when yield plain value', function() {
			const val = {d: 4};
			let yielded;
			const fn = co(function*() {
				yielded = yield val;
			});
			const p = fn();
			return p.then(() => {
				expect(yielded).to.equal(val);
			});
		});
	});

	describe('yield throws when promise rejects', function() {
		it('rejects promise with error from yielded promise', function() {
			const err = new Error('boo!');
			const fn = co(function*() {
				yield Promise.reject(err);
			});
			const p = fn();
			return expect(p).to.be.rejectedWith(err);
		});

		it('aborts execution of generator function', function() {
			const err = new Error('boo!');
			let called = false;
			const fn = co(function*() {
				yield Promise.reject(err);
				called = true;
			});
			const p = fn();
			return p.then(
				() => {throw new Error('Should not resolve');},
				() => {
					expect(called).to.be.false;
				}
			);
		});

		it('catch block called', function() {
			const err = new Error('boo!');
			let caught;
			const fn = co(function*() {
				try {
					yield Promise.reject(err);
				} catch (_err) {
					caught = err;
				}
			});
			const p = fn();
			return p.then(() => {
				expect(caught).to.equal(err);
			});
		});

		it('finally block called', function() {
			const err = new Error('boo!');
			let called = false;
			const fn = co(function*() {
				try {
					yield Promise.reject(err);
				} finally {
					called = true;
				}
			});
			const p = fn();
			return p.then(
				() => {throw new Error('Should not resolve');},
				() => {
					expect(called).to.be.true;
				}
			);
		});
	});
});
