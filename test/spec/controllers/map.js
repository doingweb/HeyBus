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
		sinon.spy(geolocation, 'getLocation');

		transitData = _transitData_;
		sinon.spy(transitData, 'getRoutes');

		scope = $rootScope.$new();
		MapCtrl = $controller('MapCtrl', {
			$scope: scope
		});
	}));

	it('should default the zoom level to 13', function () {
		expect(scope.map.zoom).to.equal(13);
	});

	it('should set the map center to the user\'s current location', function (done) {
		geolocation.promises.getLocation().then(function (location) {
			expect(scope.map.center.latitude).to.equal(location.coords.latitude);
			expect(scope.map.center.longitude).to.equal(location.coords.longitude);
			done();
		});
		scope.$apply();
	});

	it('should set up the route options', function (done) {
		transitData.promises.getRoutes.then(function (routes) {
			expect(scope.routeOptions).to.equal(routes);
			done();
		});
		scope.$apply();
	});

	it('should initialize an empty object for selected routes', function () {
		expect(scope.routesToDisplay).to.be.instanceOf(Object);
		expect(scope.routesToDisplay).to.be.empty;
	});
});
