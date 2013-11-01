'use strict';

angular.module('HeyBusApp')
	.controller('MainCtrl', function ($scope, Geolocation) {
		$scope.markers = [];
		$scope.zoom = 8;
		$scope.center = {
			latitude: 0,
			longitude: 0
		};
		Geolocation.getClientLocation(function (coords) {
			$scope.center = {
				latitude: coords.latitude,
				longitude: coords.longitude
			};
			$scope.$apply();
		});
	});
