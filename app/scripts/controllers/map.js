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

		TransitData.getRouteDetails(5).then(function (data) {
			console.group('Details for I Route (or whatever route shape 5 is)')
			console.dir(data);
			console.groupEnd();
		});

		TransitData.getBusLocations([2,3,5,6,9]).then(function (data) {
			console.group('Some bus locations')
			console.dir(data);
			console.groupEnd();
		});
	}]);
