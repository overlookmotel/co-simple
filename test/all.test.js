/* --------------------
 * co-simple module
 * Tests
 * ------------------*/

'use strict';

// Modules
const chai = require('chai'),
	{expect} = chai,
	co = require('../lib/');

// Init
chai.config.includeStack = true;

// Tests

/* jshint expr: true */
/* global describe, it */

describe('Tests', function() {
	it.skip('all', function() {
		expect(co).to.be.ok;
	});
});
