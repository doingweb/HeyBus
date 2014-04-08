'use strict';

angular.module('geolocation', [])
	.factory('geolocation', function ($q) {
		var fixture = {
			location: {
				coords: {
					latitude: 11,
					longitude: 12
				}
			}
		};

		function getLocation () {
			return $q.when(fixture.location);
		}

		return {
			fixture: fixture,
			getLocation: getLocation
		};
	});
