'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', function ($scope, Geolocation) {
		console.log("Creating MapCtrl!");
		$scope.mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		Geolocation.getClientLocation(function (coords) {
			$scope.gmap.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
		});
	});
