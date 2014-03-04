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

		$scope.$watchCollection('routesToDisplay', updateRouteVisibility);

		$interval(updateSelectedRouteBusLocations, 5000);

		function setMapCenterToLocation (location) {
			$scope.gmap.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
		}

		function updateRouteVisibility (routesToDisplay) {
			angular.forEach(routesToDisplay, function (routeIsSelected, routeId) {
				var route = routes[routeId];
				if (route) {
					if (routeIsSelected) {
						route.showMarkers();
					} else {
						route.hideMarkers();
					}
				}
			});
		}

		function updateSelectedRouteBusLocations () {
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
			self.markers = {
				buses: {},
				stops: {},
				path: {}
			};
			self.updateBusLocations = function (busLocations) {
				self.lastBusLocations = busLocations;
				busLocations.forEach(updateBusMarkers);
			};
			self.showMarkers = showMarkers;
			self.hideMarkers = hideMarkers;

			function updateBusMarkers (busLocation) {
				// console.log(busLocation.name + ' route bus \'' + busLocation.id + '\' was at ' + busLocation.lat + ', ' + busLocation.long + ' at ' + busLocation.timestamp);
				var gmapLatLng = new google.maps.LatLng(busLocation.lat, busLocation.long);
				if (self.markers.buses[busLocation.id]) {
					self.markers.buses[busLocation.id].setPosition(gmapLatLng);
				} else {
					self.markers.buses[busLocation.id] = new google.maps.Marker({
						position: gmapLatLng,
						map: $scope.gmap,
						title: self.details.name + ' (' + busLocation.id + ')'
					});
				}
			}

			function showMarkers () {
				setVisibleForAllMarkers(true);
			}

			function hideMarkers () {
				setVisibleForAllMarkers(false);
			}

			function setVisibleForAllMarkers (visible) {
				angular.forEach(self.markers, function (markerGroup) {
					angular.forEach(markerGroup, function (marker) {
						marker.setVisible(visible);
					});
				});
			}
		}
	}]);
