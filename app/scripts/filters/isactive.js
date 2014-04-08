'use strict';

angular.module('HeyBusApp')
	.filter('isActive', function () {
		return function (input) {
			return input.filter(function (item) {
				return item.active === true;
			});
		};
	});
