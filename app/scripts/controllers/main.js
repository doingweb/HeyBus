'use strict';

angular.module('HeyBusApp')
	.controller('MainCtrl', function ($scope) {
		$scope.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma',
			'Twitter Bootstrap'
		];
		$scope.selectedThing = '';
		$scope.setSelectedThing = function (thing) {
			console.log('Selected Thing was set to ' + thing);
			$scope.selectedThing = thing;
		};
	});
