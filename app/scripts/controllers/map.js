'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', ['$scope', 'Geolocation', 'TransitData', function ($scope, Geolocation, TransitData) {
		$scope.mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		Geolocation.getClientLocation().then(function (coords) {
			$scope.gmap.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
		});

		TransitData.getRouteDetails(1).then(function (data) {
			console.group('Details for Route 0')
			console.dir(data);
			console.groupEnd();
		});
	}]);
