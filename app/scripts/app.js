'use strict';

function onGoogleMapsReady () {
	angular.bootstrap(document.body, ['HeyBusApp']);
}

angular.module('HeyBusApp', ['ui.bootstrap', 'ui.map', 'ngRoute', 'ngAnimate', 'geolocation'])
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
