'use strict';

describe('Filter: isActive', function () {

	// load the filter's module
	beforeEach(module('HeyBusApp'));

	// initialize a new instance of the filter before each test
	var isActive;
	beforeEach(inject(function ($filter) {
		isActive = $filter('isActive');
	}));

	it('should return elements with a true `active` property', function () {
		var input = [
			{ active: true },
			{ active: false },
			{ active: 1 },
			{ active: '' },
			{ active: 0 },
			{ active: undefined },
			{ active: null },
			{ active: NaN },
			{ active: {} },
			{ active: [] }
		];
		expect(isActive(input)).to.have.length(1);
	});

});
