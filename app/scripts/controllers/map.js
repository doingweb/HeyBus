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

		$scope.displayRoute = {};

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
					routeInfo[routeId] = { details: routeDetails }; // TODO: Add a map marker, too, but make it inactive or hidden or something.
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
				console.log('This is where we would be plotting ' + loc.name + ' at ' + loc.lat + ', ' + loc.long);
				console.dir(routeInfo);
			});
		}
	}]);
