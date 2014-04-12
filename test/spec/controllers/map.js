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
		var route;
		beforeEach(function () {
			sinon.spy(transitData, 'getRouteDetails');
			scope.$apply();
			route = scope.routes[0];
			route.active = true;
			scope.$apply();
		});
		afterEach(function () {
			transitData.getRouteDetails.restore();
		})

		it('should fetch the details of a route when it becomes active', function () {
			var details = transitData.fixture.routeDetails[route.id];

			expect(route.busGroup).to.equal(details.busGroup);
			expect(route.color).to.equal(details.color);
			expect(route.path).to.eql(details.path);
			expect(route.stops).to.eql(details.stops);
		});

		it('should only fetch details once for a route', function () {
			route.active = false;
			scope.$apply();

			route.active = true;
			scope.$apply();

			assert(transitData.getRouteDetails.calledOnce);
		});

		it('should include all of a route\'s stops in the active stops list when the route is activated', function () {
			var route2 = scope.routes[1];
			route2.active = true;
			scope.$apply();
			var activeStopsObject = convertToObjectWithIdProperties(scope.activeRouteStops);

			route.stops.forEach(isInActiveStopsObject);
			route2.stops.forEach(isInActiveStopsObject);

			function isInActiveStopsObject (stop) {
				expect(activeStopsObject).to.contain.key(stop.id.toString());
			};
		});
	});

	describe('Bus Locations', function () {
		var route;
		beforeEach(function () {
			sinon.spy(transitData, 'getBusLocations');
			scope.$apply();
			route = scope.routes[0];
			route.active = true;
			scope.$apply();
		});
		afterEach(function () {
			transitData.getBusLocations.restore();
		});

		it('should get bus locations immediately after being activated', function () {
			assert(transitData.getBusLocations.calledOnce);
			expect(Object.keys(route.buses)).to.have.length.above(0);
		});

		it('should get bus locations periodically when activated', function () {
			interval.flush(scope.busLocationRefreshRate);
			assert(transitData.getBusLocations.calledTwice);
			interval.flush(scope.busLocationRefreshRate);
			assert(transitData.getBusLocations.calledThrice);

			route.active = false;
			scope.$apply();
		});

		it('should not get locations after being deactivated', function () {
			route.active = false;
			scope.$apply();
			interval.flush(scope.busLocationRefreshRate);

			assert(transitData.getBusLocations.calledOnce);
		});

		describe('what gets updated', function () {
			var busId, previousBusLocation, previousBusLocationCopy, newBusLocations;
			beforeEach(function () {
				busId = transitData.fixture.busLocations[route.busGroup][0].id;
				previousBusLocation = route.buses[busId].location;
				previousBusLocationCopy = angular.copy(previousBusLocation);
				newBusLocations = [
					{
						id: busId,
						location: {
							latitude: Math.random(),
							longitude: Math.random(),
							heading: Math.random(),
							timestamp: new Date()
						}
					}
				];
				transitData.fixture.busLocations[route.busGroup] = newBusLocations;

				interval.flush(scope.busLocationRefreshRate);
			});

			it('should update latitude, longitude, heading, and timestamp when bus locations are updated', function () {
				expect(route.buses[busId].location.latitude).to.not.equal(previousBusLocationCopy.latitude);
				expect(route.buses[busId].location.longitude).to.not.equal(previousBusLocationCopy.longitude);
				expect(route.buses[busId].location.heading).to.not.equal(previousBusLocationCopy.heading);
				expect(route.buses[busId].location.timestamp).to.not.equal(previousBusLocationCopy.timestamp);
			});

			it('should keep the same bus location object when bus locations are updated, to prevent flickering', function () {
				expect(route.buses[busId].location).to.equal(previousBusLocation);
			});
		});
	});

	function convertToObjectWithIdProperties (input) {
		var result = {};
		for (var i = 0; i < input.length; i++) {
			var item = input[i];
			result[item.id] = item;
		}
		return result;
	}
});
