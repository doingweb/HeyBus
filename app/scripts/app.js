'use strict';

angular.module('HeyBusApp', ['ui.bootstrap', 'google-maps', 'ngRoute', 'ngAnimate', 'geolocation'])
	.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				controller: 'MapCtrl',
				templateUrl: 'views/map.html'
			})
			.otherwise({
				redirectTo: '/'
			});
		$locationProvider
			.html5Mode(true);
	}]);
