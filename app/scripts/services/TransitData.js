'use strict';

angular.module('HeyBusApp')
	.factory('TransitData', ['$q', '$window', function TransitData ($q, $window) {
		var
			baseURL = 'http://pullman.mapstrat.com/nextvehicle/',
			// baseURL = 'http://localhost:3000/',
			routeDetailBaseURL = baseURL + 'RouteDetails.axd?Shape=',
			locationBaseURL = baseURL + 'BusLocator.axd?ShapeIDs=',
			arrivalsBaseURL = baseURL + 'RouteArrivals.axd?StopID=',
			requestQueue = (function () {
				var
					queue = new Array(),
					add = function (type, params, url) {
						var
							deferred = $q.defer(),
							injectedScript = $window.document.createElement('script');
						injectedScript.src = url;
						injectedScript.async = true;
						$window.document.body.appendChild(injectedScript);
						queue.push({
							type: type,
							params: params,
							deferred: deferred,
							script: injectedScript
						});
						return deferred.promise;
					},
					resolve = function (type, params, data) {
						var requestToResolve = queue.filter(function (element) {
							// TODO: We can't guarantee that we've found the correct deferred request
							//  when we're looking for an arbitrary array of params that may or may not all come back.
							//  Redesign this to use a timer to collect bus locations in groups,
							//  and have that be responsible for resolving each individual request by an individual param.
							return element.type === type && element.params === params;
						})[0];
						requestToResolve.deferred.resolve(data);
						$window.document.body.removeChild(requestToResolve.script);
						queue.splice(queue.indexOf(requestToResolve), 1);
					};
				return {
					add: add,
					resolve: resolve
				};
			})();

		$window.gRouteManager = {
			Add: function (shape) {
				requestQueue.resolve('routeDetails', shape.routeShapeId, shape);
			}
		};

		var
			getRouteDetails = function (id) {
				var promise = requestQueue.add('routeDetails', id, routeDetailBaseURL + id);
				return promise;
			},
			getBusLocations = function (ids) {
				var promise = requestQueue.add('busLocations', ids, locationBaseURL + ids.join(','));
				return promise;
			};

		$window.SmiTransitShape = function (busId, names, color, moreNames, routeId, customerCode, unknown2, stops, routePoints) {
			this.id = routeId;
			this.allNames = names.split('ÿ');
			this.name = this.allNames[0];
			this.routeShapeId = routeShapeId;
			this.stops = stops;
			this.routePoints = routePoints;
		};
		$window.SmiTransitWaypoint = function (stopId, name, lat, long, unknown1, unknown2, busId, customerCode) {
			this.id = stopId;
			this.name = name;
			this.lat = lat;
			this.long = long;
		};
		$window.SmiTransitShapePoint = function (busId, name, lat, long, unknown1) {
			this.lat = lat;
			this.long = long;
		};

		$window.PlotBusLocations = function (busLocations) {
			var returnedParams = busLocations.map(function (element) {
				return element.id;
			});
			requestQueue.resolve('busLocations', returnedParams, busLocations);
		};
		$window.SmiTransitVehicleLocation = function (unknown1, lat, long, busId, heading, busImageUrl, routeName, routeId, timestampHtml) {
			this.id = busId;
			this.lat = lat;
			this.long = long;
			this.heading = heading;
			this.name = routeName;
			var timestampParts = timestampHtml.match(/(\d{2}:\d{2}:\d{2}) (AM|PM)/);
			// TODO this.timestamp = ;
		};

		return {
			getRouteDetails: getRouteDetails,
			getBusLocations: getBusLocations
		};
	}]);
