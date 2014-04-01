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
		transitData.getRoutes().then(function (routeNames) {
			$scope.routes = routeNames;
			$scope.routes.forEach(function (route, index) {
				route.active = false;
				fetchDetailsWhenRouteBecomesActive(route, index);
				$scope.$watch('routes[' + index + '].active', updateActiveRouteStops);
				$scope.$watchCollection('routes[' + index + '].stops', updateActiveRouteStops);
			});
		});

		function fetchDetailsWhenRouteBecomesActive (route, index) {
			var unwatchForFetchingDetails = $scope.$watch('routes[' + index + '].active', function (newValue) {
				if (newValue) {
					fetchRouteDetails(route)
						.catch(continuouslyRetryFetchingRouteDetails);
					unwatchForFetchingDetails();
				}
			});

			function continuouslyRetryFetchingRouteDetails () {
				var retry = $interval(retryFetch, $scope.retryTimeout);

				function retryFetch () {
					fetchRouteDetails(route).then(cancelRetrying);
				}

				function cancelRetrying () {
					$interval.cancel(retry);
				}
			}
		}

		function fetchRouteDetails (route) {
			return transitData.getRouteDetails(route.id).then(function (routeDetails) {
				route.busGroup = routeDetails.busGroup;
				route.color = routeDetails.color;
				route.path = routeDetails.path;
				route.stops = routeDetails.stops;
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

			for (var stopId in stopsHash) {
				$scope.activeRouteStops.push(stopsHash[stopId]);
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
