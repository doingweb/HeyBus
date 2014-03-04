'use strict';

describe('Controller: MapCtrl', function () {

	// load the controller's module
	beforeEach(module('HeyBusApp'));

	beforeEach(module('ui.bootstrap'));
	beforeEach(module('ui.map'));

	var MapCtrl,
		scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		MapCtrl = $controller('MapCtrl', {
			$scope: scope
		});
	}));

	it('should set mapOptions', function () {
		expect(scope.mapOptions).toBeDefined();
	});
});
