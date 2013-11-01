'use strict';

angular.module('HeyBusApp')
	.service('Geolocation', function Geolocation ($window) {
		this.getClientLocation = function (callback) {
			$window.navigator.geolocation.getCurrentPosition(function (position) {
				callback({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				})
			});
		};
	});
