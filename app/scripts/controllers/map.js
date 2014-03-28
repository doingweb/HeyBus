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
		transitData.getRoutes().then(function (routeNames) {
			$scope.routes = routeNames;
			$scope.routes.forEach(function (route, index) {
				route.active = false;
				$scope.$watch('routes[' + index + '].active', function () {
					fetchRouteDetails(route);
				});
			});

		//
		// 	whenRouteStopsChange(updateActiveRouteStops);
		// 	whenActiveRoutesChange(updateActiveRouteStops);
		});

		// TODO: Bus locations!

		$scope.activeRouteStops = [];

		function updateActiveRouteStops () {
			var allStops = [];
			var stopsHash = {};
			$scope.activeRouteStops = [];

			var activeRoutes = isActiveFilter($scope.routes);
			activeRoutes.forEach(function (route) {
				allStops = allStops.concat(route.stops);
			});

			for (var i = 0; i < allStops.length; i++) {
				var stop = allStops[i];
				stopsHash[stop.id] = stop;
			}

			for (var stopId in stopsHash) {
				$scope.activeRouteStops.push(stopsHash[stopId]);
			}
		}

		function fetchRouteDetails (route) {
			transitData.getRouteDetails(route.id).then(function (routeDetails) {
				route.busGroup = routeDetails.busGroup;
				route.color = routeDetails.color;
				route.path = routeDetails.path;
				route.stops = routeDetails.stops;
			});
		}

		function whenRouteStopsChange (listener) {
			for (var i = 0; i < $scope.routes.length; i++) {
				$scope.$watchCollection('routes[' + i + '].stops', listener);
			}
		}

		function setMapCenterToLocation (location) {
			$scope.map.center = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude
			};
		}

		// function updateSelectedRouteBusLocations () {
		// 	angular.forEach($scope.routesToDisplay, function (routeIsSelected, routeId) {
		// 		if (routeIsSelected) {
		// 			var route = routes[routeId];
		// 			if (route) {
		// 				updateRouteBusLocations(route);
		// 			} else {
		// 				transitData.getRouteDetails(routeId).then(addRoute).then(updateRouteBusLocations);
		// 			}
		// 		}
		// 	});

		// 	function updateRouteBusLocations (route) {
		// 		transitData.getBusLocations(route.details.busId).then(route.updateBusLocations);
		// 	}
		// }
	});
