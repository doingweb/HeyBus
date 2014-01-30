'use strict';

angular.module('HeyBusApp')
	.factory('TransitData', ['$q', '$window', function TransitData ($q, $window) {
		$window.SmiTransitShape = function (id, names, color, moreNames, unknown1, customerCode, unknown2, stops, routePoints) {
			this.id = id;
			this.allNames = names.split('ÿ');
			this.name = this.allNames[0];
			this.stops = stops;
			this.routePoints = routePoints;
		};
		$window.SmiTransitWaypoint = function (id, name, lat, long, unknown1, unknown2, routeId, customerCode) {
			this.id = id;
			this.name = name;
			this.lat = lat;
			this.long = long;
		};
		$window.SmiTransitShapePoint = function (routeId, name, lat, long, unknown1) {
			this.lat = lat;
			this.long = long;
		};

		$window.PlotBusLocations = function (busLocations) {
			requestQueue.resolve('location', busLocations);
		};
		$window.SmiTransitVehicleLocation = function (unknown1, lat, long, shapeId, unknown3, busImageUrl, routeName, unknown4, timestampHtml) {
			this.id = shapeId;
			this.lat = lat;
			this.long = long;
			this.name = routeName;
			var timestampParts = timestampHtml.match(/(\d{2}:\d{2}:\d{2}) (AM|PM)$/);
			// TODO this.timestamp = ;
		};

		var
			baseURL = 'http://pullman.mapstrat.com/nextvehicle/',
			// baseURL = 'http://localhost:3000/',
			routeDetailBaseURL = baseURL + 'RouteDetails.axd?Shape=',
			locationBaseURL = baseURL + 'BusLocator.axd?&ShapeIDs=',
			requestQueue = (function () {
				var
					queue = new Array(),
					add = function (url) {
						var
							deferred = $q.defer(),
							injectedScript = $window.document.createElement('script');
						injectedScript.src = url;
						injectedScript.async = true;
						$window.document.body.appendChild(injectedScript);
						queue.push({
							// TODO: Something to identify the request later.
							deferred: deferred,
							script: injectedScript
						});
						return deferred.promise;
					},
					resolve = function (type, params) {
						// TODO: Resolve the promise and remove the injected script.
					};
				return {
					add: add,
					resolve: resolve
				};
			})();

		$window.gRouteManager = {
			Add: function (shape) {
				requestQueue.resolve('routeDetails', shape);
			}
		};

		var
			getRouteDetails = function (id) {
				var promise = requestQueue.add(routeDetailBaseURL + id);
				return promise;
			},
			getBusLocations = function (ids) {
				// TODO: Is this extra comma prefix necessary?
				var promise = requestQueue.add(locationBaseURL + ',' + ids.join(','));
				return promise;
			};

		return {
			getRouteDetails: getRouteDetails,
			getBusLocations: getBusLocations
		};
	}]);
