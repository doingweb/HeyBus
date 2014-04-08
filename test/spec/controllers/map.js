'use strict';

describe('Controller: MapCtrl', function () {
	var MapCtrl,
		scope,
		q,
		interval,
		geolocation,
		transitData;

	beforeEach(module('HeyBusApp'));

	beforeEach(module('ui.bootstrap'));
	beforeEach(module('google-maps'));
	beforeEach(module('geolocation'));

	beforeEach(inject(function ($controller, $rootScope, $q, $interval, _geolocation_, _transitData_) {
		q = $q;
		interval = $interval;
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

	describe('Route Details', function () {
		beforeEach(function () {
			scope.$apply();
		});

		it('should fetch the details of a route when it becomes active', function () {
			for (var i = 0; i < scope.routes.length; i++) {
				var route = scope.routes[i];
				var details = transitData.fixture.routeDetails[route.id];
				route.active = true;
				scope.$apply();

				expect(route.busGroup).to.equal(details.busGroup);
				expect(route.color).to.equal(details.color);
				expect(route.path).to.eql(details.path);
				expect(route.stops).to.eql(details.stops);
			}
		});

		it('should only fetch details once for each route if successful', function () {
			var routeDetailSpy = sinon.spy(transitData, 'getRouteDetails');
			scope.$apply();

			var i;
			for (i = 0; i < scope.routes.length; i++)
				scope.routes[i].active = true;
			scope.$apply();

			for (i = 0; i < scope.routes.length; i++)
				scope.routes[i].active = false;
			scope.$apply();

			for (i = 0; i < scope.routes.length; i++)
				scope.routes[i].active = true;
			scope.$apply();

			for (i = 0; i < scope.routes.length; i++)
				assert(routeDetailSpy.withArgs(scope.routes[i].id).calledOnce);
		});

		it('should include all of a route\'s stops in the active stops list when the route is activated', function () {
			for (var i = 0; i < scope.routes.length; i++) {
				var route = scope.routes[i];
				route.active = true;
				scope.$apply();

				var activeStopsHash = getHashOfStops(scope.activeRouteStops);
				route.stops.forEach(function (stop) {
					expect(activeStopsHash).to.contain.key(stop.id.toString());
				});
			}

			function getHashOfStops (stopsArray) {
				var hash = {};
				for (var i = 0; i < stopsArray.length; i++) {
					var stop = stopsArray[i];
					hash[stop.id] = stop;
				}
				return hash;
			}
		});
	});

	describe('Bus Locations', function () {
		beforeEach(function () {
			sinon.spy(transitData, 'getBusLocations');
			scope.$apply();
		});
		afterEach(function () {
			transitData.getBusLocations.restore();
		});

		it('should get bus locations immediately after being activated', function () {
			for (var i = 0; i < scope.routes.length; i++) {
				var route = scope.routes[i];
				transitData.getBusLocations.reset();
				route.active = true;
				scope.$apply();

				assert(transitData.getBusLocations.calledOnce);
				expect(route.buses).to.exist;
			}
		});

		it('should get bus locations periodically when activated', function () {
			for (var i = 0; i < scope.routes.length; i++) {
				var route = scope.routes[i];
				transitData.getBusLocations.reset();
				route.active = true;
				scope.$apply();

				interval.flush(scope.busLocationRefreshRate);
				assert(transitData.getBusLocations.calledTwice);
				interval.flush(scope.busLocationRefreshRate);
				assert(transitData.getBusLocations.calledThrice);

				route.active = false;
				scope.$apply();
			}
		});

		it('should not get locations after being deactivated', function () {
			for (var i = 0; i < scope.routes.length; i++) {
				var route = scope.routes[i];
				transitData.getBusLocations.reset();
				route.active = true;
				scope.$apply();
				route.active = false;
				scope.$apply();
				interval.flush(scope.busLocationRefreshRate);

				assert(transitData.getBusLocations.calledOnce);
			}
		});
	});
});
