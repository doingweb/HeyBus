'use strict';

angular.module('HeyBusApp')
	.factory('TransitData', ['$q', '$window', function TransitData ($q, $window) {
		var
			baseURL = 'http://pullman.mapstrat.com/nextvehicle/',
			// baseURL = 'http://localhost:3000/',
			getApiUrl = function (type, param) {
				switch (type) {
					case 'routeDetails':
						return baseURL + 'RouteDetails.axd?Shape=' + param;
					case 'busLocation':
						return baseURL + 'BusLocator.axd?ShapeIDs=' + param;
					case 'arrivals':
						return baseURL + 'RouteArrivals.axd?StopID=' + param;
				}
			},
			apiQueue = (function () {
				var
					queue = new Array(),
					add = function (type, param) {
						var
							apiCall = {
								type: type,
								param: param,
								scriptId: injectedScriptList.add(getApiUrl(type, param)),
								deferred: $q.defer()
							};
						queue.push(apiCall);
						return apiCall;
					},
					resolve = function (type, param, data) {
						var requestToResolve = queue.filter(function (element) {
							return element.type === type && element.param === param;
						})[0];
						requestToResolve.deferred.resolve(data);
						injectedScriptList.remove(requestToResolve.scriptId);
						queue.splice(queue.indexOf(requestToResolve), 1);
					};
				return {
					add: add,
					resolve: resolve
				};
			})(),
			injectedScriptList = (function () {
				var
					queue = {},
					add = function (url) {
						var injectedScript = $window.document.createElement('script');
						injectedScript.src = url;
						injectedScript.async = true;
						$window.document.body.appendChild(injectedScript);
						var key = generateUniqueKeyForUrl(url);
						queue[key] = injectedScript;
						return key;
					},
					remove = function (key) {
						$window.document.body.removeChild(queue[key]);
						delete queue[key];
					};
				return {
					add: add,
					remove: remove
				};
			})(),
			generateUniqueKeyForUrl = function (url) {
				return Math.random().toString().substring(2) + url.substring(url.lastIndexOf('/') + 1);
			},
			getRouteDetails = function (id) {
				var apiCall = apiQueue.add('routeDetails', id);
				return apiCall.deferred.promise;
			},
			getBusLocation = function (id) {
				var apiCall = apiQueue.add('busLocation', id);
				return apiCall.deferred.promise;
			};

		$window.gRouteManager = {
			Add: function (shape) {
				apiQueue.resolve('routeDetails', shape.id, shape);
			}
		};

		$window.SmiTransitShape = function (busId, names, color, moreNames, routeId, customerCode, unknown2, stops, routePoints) {
			this.id = routeId;
			this.busId = busId;
			this.allNames = names.split('ÿ');
			this.name = this.allNames[0];
			this.stops = stops;
			this.routePoints = routePoints;
		};
		$window.SmiTransitWaypoint = function (stopId, name, lat, long, unknown1, unknown2, busId, customerCode) {
			this.id = stopId;
			this.name = name;
			this.lat = lat;
			this.long = long;
			this.busId = busId;
		};
		$window.SmiTransitShapePoint = function (busId, name, lat, long, unknown1) {
			this.lat = lat;
			this.long = long;
		};

		$window.PlotBusLocations = function (busLocations) {
			var returnedParams = busLocations.map(function (element) {
				return element.id;
			});
			apiQueue.resolve('busLocation', returnedParams[0], busLocations);
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
			getBusLocation: getBusLocation
		};
	}]);
