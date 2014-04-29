'use strict';

angular.module('HeyBusApp', ['ui.bootstrap', 'google-maps', 'ngRoute', 'ngAnimate', 'geolocation', 'angulartics', 'angulartics.google.analytics'])
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
