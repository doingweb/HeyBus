'use strict';

angular.module('HeyBusApp', ['ui.bootstrap', 'google-maps'])
	.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				controller: 'MainCtrl', // TODO: Turn into 'MapCtrl'
				templateUrl: 'views/main.html'
			})
			.otherwise({
				redirectTo: '/'
			});
		$locationProvider
			.html5Mode(true);
	});
