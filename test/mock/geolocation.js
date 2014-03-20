'use strict';

angular.module('geolocation', [])
	.factory('geolocation', function ($q) {
		var getLocationPromise;

		function getLocation () {
			getLocationPromise = $q.when({
				coords: {
					latitude: 11,
					longitude: 12
				}
			});

			return getLocationPromise;
		}

		return {
			getLocation: getLocation,
			promises: {
				getLocation: function () { return getLocationPromise; }
			}
		};
	});
