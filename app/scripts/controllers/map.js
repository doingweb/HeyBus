'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', ['$scope', '$interval', '$q', 'geolocation', 'TransitData', function ($scope, $interval, $q, geolocation, transitData) {
		$scope.mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		geolocation.getLocation().then(function (data) {
			$scope.gmap.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
		});

		transitData.getRoutes().then(function (routes) {
			$scope.routes = routes;
		});

		$scope.displayRoute = {}; // TODO: This might be a good thing to save to localStorage.

		$interval(updateBusLocations, 5000);

		function updateBusLocations () {
			angular.forEach($scope.displayRoute, function (selected, routeId) {
				var busId;
				if (selected) {
					getRouteInfo(routeId)
						.then(updateBusMarker);
				}
			});
		}

		var routeInfo = {};

		function getRouteInfo (routeId) {
			var deferred = $q.defer();

			if (routeInfo[routeId]) {
				deferred.resolve(routeInfo[routeId]);
			} else {
				transitData.getRouteDetails(routeId).then(function (routeDetails) {
					routeInfo[routeId] = {
						details: routeDetails,
						busMarker: new google.maps.Marker({
							position: new google.maps.LatLng(0, 0),
							title: routeDetails.name
						})
					};
					deferred.resolve(routeInfo[routeId]);
				}, function () {
					deferred.reject('cannot get route info');
				});
			}

			return deferred.promise;
		}

		function updateBusMarker(routeInfo) {
			transitData.getBusLocation(routeInfo.details.busId).then(function (busLocation) {
				var loc = busLocation[0];
				routeInfo.lastLocation = loc;
				routeInfo.busMarker.setPosition(new google.maps.LatLng(loc.lat, loc.long));
				if (!routeInfo.busMarker.map)
					routeInfo.busMarker.setMap($scope.gmap);
				console.log('Bus ' + loc.name + ' was at ' + loc.lat + ', ' + loc.long + ' at ' + loc.timestamp);
			});
		}
	}]);
