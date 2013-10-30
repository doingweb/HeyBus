'use strict';

angular.module('HeyBusApp', ['ui.bootstrap'])
	.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				controller: 'MainCtrl',
				templateUrl: 'views/main.html'
			})
			.when('/bus/:name', {
				controller: 'BusCtrl',
				templateUrl: 'views/bus.html'
			})
			.otherwise({
				redirectTo: '/'
			});
		$locationProvider
			.html5Mode(true);
	});
