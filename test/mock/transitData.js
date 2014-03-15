'use strict';

angular.module('HeyBusApp')
	.factory('transitData', function ($q) {
		var
			promises = {},
			routeOptions = {
				'0': {
					shortName: 'shortName',
					longName: 'longName'
				}
			};

		function getRoutes () {
			return promises.getRoutes = $q.when(routeOptions);
		}

		return {
			promises: promises,
			getRoutes: getRoutes
		};
	});
