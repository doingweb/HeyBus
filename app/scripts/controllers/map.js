'use strict';

angular.module('HeyBusApp')
	.controller('MapCtrl', ['$scope', 'geolocation', 'TransitData', function ($scope, geolocation, transitData) {
		$scope.mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		geolocation.getLocation().then(function (data) {
			$scope.gmap.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
		});

		transitData.getRouteDetails(5).then(function (data) {
			console.group('route 5')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getRouteDetails(0).then(function (data) {
			console.group('route 0')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getRouteDetails(3).then(function (data) {
			console.group('route 3')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getRouteDetails(2).then(function (data) {
			console.group('route 2')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getBusLocation(9).then(function (data) {
			console.group('bus 9')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getBusLocation(18).then(function (data) {
			console.group('bus 18')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getBusLocation(17).then(function (data) {
			console.group('bus 17')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getBusLocation(3).then(function (data) {
			console.group('bus 3')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getBusLocation(5).then(function (data) {
			console.group('bus 5')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getBusLocation(6).then(function (data) {
			console.group('bus 6')
			console.dir(data);
			console.groupEnd();
		});

		transitData.getRoutes().then(function (data) {
			console.dir(data);
		})
	}]);
