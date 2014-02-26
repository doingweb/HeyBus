'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', ['$scope', '$interval', 'geolocation', 'TransitData', function ($scope, $interval, geolocation, transitData) {
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

		$scope.routeSelection = {};

		$interval(updateBusLocations, 5000);

		function updateBusLocations () {
			angular.forEach($scope.routeSelection, function (selected, routeId) {
				if (selected)
					transitData.getBusLocation(routeId).then(plotBus);
			});
		}

		function plotBus(busLocation) {
			var loc = busLocation[0];
			console.log('This is where we would be plotting bus on route ' + loc.id + ' at ' + loc.lat + ', ' + loc.long);
		}
	}]);
