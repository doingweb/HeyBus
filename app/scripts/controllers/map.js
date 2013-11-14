'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', function ($scope, Geolocation) {
		$scope.mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		Geolocation.getClientLocation()
			.then(function (coords) {
				$scope.gmap.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
			});
	});
