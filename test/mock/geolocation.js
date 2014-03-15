'use strict';

angular.module('geolocation', [])
	.value('currentLocationCoords', {
		latitude: 11,
		longitude: 12
	})
	.factory('geolocation', function ($q, currentLocationCoords) {
		var getLocationPromise;

		function getLocation () {
			getLocationPromise = $q.when({
				coords: currentLocationCoords
			});

			return getLocationPromise;
		}

		return {
			getLocation: getLocation,
			getLocationPromise: function () { return getLocationPromise; }
		};
	});
