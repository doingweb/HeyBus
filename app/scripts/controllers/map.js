'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', ['$scope', '$interval', '$q', 'geolocation', 'TransitData', function ($scope, $interval, $q, geolocation, transitData) {
		$scope.mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		geolocation.getLocation().then(setMapCenterToLocation);

		transitData.getRoutes().then(function (routes) {
			$scope.routeOptions = routes;
		});

		$scope.routesToDisplay = {}; // TODO: This might be a good thing to save to localStorage.
		var routes = {};

		$interval(updateSelectedRoutes, 5000);

		function setMapCenterToLocation (location) {
			$scope.gmap.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
		}

		function updateSelectedRoutes () {
			angular.forEach($scope.routesToDisplay, function (routeIsSelected, routeId) {
				if (routeIsSelected) {
					var route = routes[routeId];
					if (route) {
						updateRouteBusLocations(route);
					} else {
						transitData.getRouteDetails(routeId).then(addRoute).then(updateRouteBusLocations);
					}
				}
			});

			function addRoute (routeDetails) {
				var route = new Route(routeDetails);
				routes[routeDetails.id] = route;
				return route;
			}

			function updateRouteBusLocations (route) {
				transitData.getBusLocations(route.details.busId).then(route.updateBusLocations);
			}
		}

		function Route (routeDetails) {
			var self = this;
			self.details = routeDetails;
			self.busMarkers = {};
			self.updateBusLocations = function (busLocations) {
				self.lastBusLocations = busLocations;
				busLocations.forEach(updateBusMarker);
			};

			function updateBusMarker (busLocation) {
				console.log(busLocation.name + ' route bus \'' + busLocation.id + '\' was at ' + busLocation.lat + ', ' + busLocation.long + ' at ' + busLocation.timestamp);
				var gmapLatLng = new google.maps.LatLng(busLocation.lat, busLocation.long);
				if (self.busMarkers[busLocation.id]) {
					self.busMarkers[busLocation.id].setPosition(gmapLatLng);
				} else {
					self.busMarkers[busLocation.id] = new google.maps.Marker({
						position: gmapLatLng,
						map: $scope.gmap,
						title: self.details.name + ' (' + busLocation.id + ')'
					});
				}
			}
		}
	}]);
