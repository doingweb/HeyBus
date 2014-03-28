'use strict';

describe('Controller: MapCtrl', function () {
	var MapCtrl,
		scope,
		geolocation,
		transitData;

	beforeEach(module('HeyBusApp'));

	beforeEach(module('ui.bootstrap'));
	beforeEach(module('google-maps'));
	beforeEach(module('geolocation'));

	beforeEach(inject(function ($controller, $rootScope, _geolocation_, _transitData_) {
		geolocation = _geolocation_;
		transitData = _transitData_;

		scope = $rootScope.$new();
		MapCtrl = $controller('MapCtrl', {
			$scope: scope
		});
	}));

	it('should default the zoom level to 13', function () {
		expect(scope.map.zoom).to.equal(13);
	});

	it('should set the map center to the user\'s current location', function () {
		scope.$apply();
		expect(scope.map.center.latitude).to.equal(geolocation.fixture.location.coords.latitude);
		expect(scope.map.center.longitude).to.equal(geolocation.fixture.location.coords.longitude);
	});

	it('should fetch basic information about all of the routes', function () {
		scope.$apply();
		expect(scope.routes).to.eql(transitData.fixture.routes);
	});

	// TODO: Initialize to locally-saved states instead.
	it('should initialize all routes to inactive', function () {
		scope.$apply();
		scope.routes.forEach(function (route) {
			expect(route.active).to.be.false;
		});
	});

	it('should fetch the details of a route when it becomes active', function () {
		scope.$apply();
		for (var i = scope.routes.length - 1; i >= 0; i--) {
			var route = scope.routes[i];
			var details = transitData.fixture.routeDetails[route.id];
			route.active = true;
			scope.$apply();
			expect(route.busGroup).to.equal(details.busGroup);
			expect(route.color).to.equal(details.color);
			expect(route.path).to.eql(details.path);
			expect(route.stops).to.eql(details.stops);
		};
	});
});
