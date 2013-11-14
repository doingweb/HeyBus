'use strict';

angular.module('HeyBusApp')
	.service('Geolocation', function Geolocation ($q, $window) {
		this.getClientLocation = function () {
			var deferred = $q.defer();
			$window.navigator.geolocation.getCurrentPosition(function (position) {
				deferred.resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			});
			return deferred.promise;
		};
	});
