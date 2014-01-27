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

		var
			currentInjectedScript,
			currentDeferredRequest,
			gRouteManager = {
				Add: function (shape) {
					currentDeferredRequest.resolve(shape);
					currentInjectedScript.remove();
				}
			};

		$window.gRouteManager = gRouteManager;

		var
			baseURL = 'http://pullman.mapstrat.com/nextvehicle/',
			// baseURL = 'http://localhost:3000/',
			routeDetailBaseURL = baseURL + 'RouteDetails.axd?Shape=',
			locationBaseURL = baseURL + 'BusLocator.axd?&ShapeIDs=',
			getRouteDetails = function (id) {
				currentDeferredRequest = $q.defer();

				currentInjectedScript = $window.document.createElement('script');
				currentInjectedScript.src = routeDetailBaseURL + id;
				currentInjectedScript.async = true;
				$window.document.body.appendChild(currentInjectedScript);

				return currentDeferredRequest.promise;
			},
			getBusLocations = function (ids) {
				currentDeferredRequest = $q.defer();

				currentInjectedScript = $window.document.createElement('script');
				currentInjectedScript.src = locationBaseURL + ids.join(',');
				currentInjectedScript.async = true;
				$window.document.body.appendChild(currentInjectedScript);

				return currentDeferredRequest.promise;
			};

		return {
			getRouteDetails: getRouteDetails,
			getBusLocations: getBusLocations
		};
	}]);
