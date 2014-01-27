'use strict';

angular.module('HeyBusApp')
	.factory('TransitData', ['$q', '$window', function TransitData ($q, $window) {
		$window.SmiTransitShape = function (id, name, color, a, b, c, d, e, f) {
			this.id = id;
			this.name = name;
			this.color = color;
		}
		$window.SmiTransitWaypoint = function (id, name, lat, long, a, b, c, d) {
			this.id = id;
			this.name = name;
			this.lat = lat;
			this.long = long;
		}
		$window.SmiTransitShapePoint = function (id, name, lat, long, a) {
			this.id = id;
			this.name = name;
			this.lat = lat;
			this.long = long;
		}
		var gRouteManager = {
			Add: function (shape) {
				// TODO
				console.dir(shape);
			}
		};

		$window.gRouteManager = gRouteManager;

		var
			baseURL = 'http://pullman.mapstrat.com/nextvehicle/',
			// baseURL = 'http://localhost:3000/',
			routeDetailBaseURL = baseURL + 'RouteDetails.axd?Shape=',
			locationBaseURL = baseURL + 'BusLocator.axd?&ShapeIDs=',
			getRouteDetails = function (id) {
				var deferred = $q.defer();


				var apiScript = $window.document.createElement('script');
				apiScript.src = routeDetailBaseURL + id;
				apiScript.async = true;
				$window.document.body.appendChild(apiScript);

				// $http.get(routeDetailBaseURL + id).success(function (data) {
				// 	deferred.resolve(data);
				// }).error(function (data) {
				// 	deferred.reject(data);
				// });

				return deferred.promise;
			},
			getBusLocations = function (ids) {
				var deferred = $q.defer();

				// $http.get('locationBaseURL' + ids.join(',')).success(function (data) {
				// 	deferred.resolve(data);
				// }).error(function (data) {
				// 	deferred.reject(data);
				// });

				return deferred.promise;
			};

		return {
			getRouteDetails: getRouteDetails,
			getBusLocations: getBusLocations
		};
	}]);
