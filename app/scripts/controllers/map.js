'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', function ($scope, $interval, $q, geolocation, isActiveFilter, transitData) {
		$scope.map = {
			center: {
				latitude: 0,
				longitude: 0
			},
			zoom: 13
		};

		geolocation.getLocation().then(setMapCenterToLocation);

		$scope.routes = [];
		$scope.retryTimeout = 5000;
		$scope.busLocationRefreshRate = 5000;
		transitData.getRoutes().then(function (routeNames) {
			$scope.routes = routeNames;
			$scope.routes.forEach(function (route, index) {
				route.active = false;
				route.buses = {};

				waitForRouteToBeActivated(route)
					.then(fetchRouteDetails)
					.then(periodicallyUpdateBusLocationsWhenRouteActivated);

				$scope.$watch('routes[' + index + '].active', updateActiveRouteStops);
				$scope.$watchCollection('routes[' + index + '].stops', updateActiveRouteStops);
			});
		});

		function waitForRouteToBeActivated (route) {
			var deferred = $q.defer();
			var unwatch = $scope.$watch('routes[' + $scope.routes.indexOf(route) + '].active', function (active) {
				if (active === true) {
					deferred.resolve(route);
					unwatch();
				}
			});
			return deferred.promise;
		}

		function fetchRouteDetails (route) {
			return transitData.getRouteDetails(route.id).then(function (routeDetails) {
				route.busGroup = routeDetails.busGroup;
				route.color = routeDetails.color;
				route.path = routeDetails.path;
				route.stops = routeDetails.stops;
				return route;
			});
		}

		function periodicallyUpdateBusLocationsWhenRouteActivated (route) {
			var updatingBusLocations;
			$scope.$watch('routes[' + $scope.routes.indexOf(route) + '].active', function (active) {
				if (active === true) {
					updatingBusLocations = periodicallyRetrieveBusLocations(route);
				} else if (active === false) {
					if (updatingBusLocations)
						$interval.cancel(updatingBusLocations);
				}
			});
		}

		function periodicallyRetrieveBusLocations (route) {
			fetchBusLocations(route);
			return $interval(function () {
				fetchBusLocations(route);
			}, $scope.busLocationRefreshRate);
		}

		function fetchBusLocations (route) {
			return transitData.getBusLocations(route.busGroup).then(function (busLocations) {
				busLocations.forEach(function (newBus) {
					var existingBus = route.buses[newBus.id];
					if (existingBus) {
						existingBus.location.latitude = newBus.location.latitude;
						existingBus.location.longitude = newBus.location.longitude;
						existingBus.location.heading = newBus.location.heading;
						existingBus.location.timestamp = newBus.location.timestamp;
					} else {
						route.buses[newBus.id] = newBus;
					}
				});
			});
		}

		$scope.activeRouteStops = [];

		function updateActiveRouteStops () {
			var
				allStops = [],
				stopsHash = {};
			$scope.activeRouteStops = [];

			var activeRoutes = isActiveFilter($scope.routes);
			activeRoutes.forEach(function (route) {
				if (route.stops)
					allStops = allStops.concat(route.stops);
			});

			for (var i = 0; i < allStops.length; i++) {
				var stop = allStops[i];
				stopsHash[stop.id] = stop;
			}

			for (var stopId in stopsHash)
				$scope.activeRouteStops.push(stopsHash[stopId]);
		}

		function setMapCenterToLocation (location) {
			$scope.map.center = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude
			};
		}
	});
