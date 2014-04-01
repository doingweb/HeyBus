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

	it('should fetch the details of a route when it becomes active', function () {
		scope.$apply();

		for (var i = 0; i < scope.routes.length; i++) {
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

	it('should only fetch details once for each route if successful', function () {
		var routeDetailSpy = sinon.spy(transitData, 'getRouteDetails');
		scope.$apply();

		for (var i = 0; i < scope.routes.length; i++)
			scope.routes[i].active = true;
		scope.$apply();

		for (var i = 0; i < scope.routes.length; i++)
			scope.routes[i].active = false;
		scope.$apply();

		for (var i = 0; i < scope.routes.length; i++)
			scope.routes[i].active = true;
		scope.$apply();

		for (var i = 0; i < scope.routes.length; i++)
			assert(routeDetailSpy.withArgs(scope.routes[i].id).calledOnce);
	});

	it('should retry fetching details if it fails', function () {
		sinon.stub(transitData, 'getRouteDetails').returns(q.reject());
		scope.$apply();

		var route = scope.routes[0];
		route.active = true;
		scope.$apply();

		assert(transitData.getRouteDetails.calledOnce, 'first attempt fails');
		transitData.getRouteDetails.restore();
		sinon.spy(transitData, 'getRouteDetails');
		interval.flush(scope.retryTimeout);

		assert(transitData.getRouteDetails.calledOnce, 'retries fetching details');
		interval.flush(scope.retryTimeout);

		assert(transitData.getRouteDetails.calledOnce, 'first retry succeeded; no need to re-retry');
	});

	it('should include all of a route\'s stops in the active stops list when the route is activated', function () {
		scope.$apply();

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

	// TODO: Bus locations!
});
