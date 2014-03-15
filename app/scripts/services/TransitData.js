'use strict';

angular.module('HeyBusApp')
	.factory('transitData', function transitData ($q, $window, $timeout, $http) {
		var
			baseURL = 'http://pullman.mapstrat.com/nextvehicle/',
			// baseURL = 'http://localhost:3000/',
			routeDetailsApiCall = 'routeDetails',
			busLocationApiCall = 'busLocation',
			arrivalsApiCall = 'arrivals',
			getApiUrl = function (type, param) {
				switch (type) {
					case routeDetailsApiCall:
						return baseURL + 'RouteDetails.axd?Shape=' + param;
					case busLocationApiCall:
						return baseURL + 'BusLocator.axd?ShapeIDs=' + param;
					case arrivalsApiCall:
						return baseURL + 'RouteArrivals.axd?StopID=' + param;
				}
			},
			apiQueue = (function () {
				var
					queue = new Array(),
					remove = function (request) {
						queue.splice(queue.indexOf(request), 1);
					},
					add = function (type, param) {
						var
							apiCall = {
								type: type,
								param: param,
								scriptId: injectedScriptList.add(getApiUrl(type, param)),
								deferred: $q.defer(),
								timeout: $timeout(cancelThisApiCall, 10000)
							};
						function cancelThisApiCall () {
							apiCall.deferred.reject('timeout');
							injectedScriptList.remove(apiCall.scriptId);
							remove(apiCall);
						}
						queue.push(apiCall);
						return apiCall;
					},
					resolve = function (type, param, data) {
						var requestToResolve = queue.filter(function (element) {
							return element.type === type && element.param == param;
						})[0];
						if (!requestToResolve) throw 'Unable to find corresponding API call.';

						requestToResolve.deferred.resolve(data);
						$timeout.cancel(requestToResolve.timeout);
						injectedScriptList.remove(requestToResolve.scriptId);
						remove(requestToResolve);
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
			getRoutes = function () {
				var deferred = $q.defer();

				var dayOfTheWeek = new Date().getDay();
				if (dayOfTheWeek === 0) {
					deferred.resolve(null);
				} else {
					var routesUrl = 'bus-routes/' + (dayOfTheWeek === 6 ? 'saturday.json' : 'weekday.json');
					$http.get(routesUrl).success(function (data) {
						deferred.resolve(data);
					});
				}

				return deferred.promise;
			},
			getRouteDetails = function (id) {
				var apiCall = apiQueue.add(routeDetailsApiCall, id);
				return apiCall.deferred.promise;
			},
			getBusLocations = function (id) {
				var apiCall = apiQueue.add(busLocationApiCall, id);
				return apiCall.deferred.promise;
			};

		$window.gRouteManager = {
			Add: function (shape) {
				try {
					apiQueue.resolve(routeDetailsApiCall, shape.id, shape);
				} catch (ex) {
					console.warn('Caught an unresolvable route response.');
				}
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

		$window.SmiTransitShapePoint = function (busId, name, lat, long, routeId) {
			this.lat = lat;
			this.long = long;
		};

		$window.PlotBusLocations = function (busLocations) {
			var returnedParams = busLocations.map(function (element) {
				return element.busId;
			});

			try {
				apiQueue.resolve(busLocationApiCall, returnedParams[0], busLocations);
			} catch (ex) {
				console.warn('Caught an unresolvable bus location response.');
			}
		};

		$window.SmiTransitVehicleLocation = function (physicalBusId, lat, long, busId, heading, busImageUrl, routeName, routeId, timestampHtml) {
			this.id = physicalBusId;
			this.busId = busId;
			this.lat = lat;
			this.long = long;
			this.heading = heading;
			this.name = routeName;
			var timestampParts = timestampHtml.match(/(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/);
			if (timestampParts) {
				var time = new Date();
				var hour = timestampParts[1];
				time.setHours(timestampParts[4] == 'PM' ? parseInt(hour, 10) + 12 : hour);
				time.setMinutes(timestampParts[2]);
				time.setSeconds(timestampParts[3]);
				this.timestamp = time;
			} else {
				console.error('Unable to parse timestamp: ' + timestampHtml);
			}
		};

		return {
			getRoutes: getRoutes,
			getRouteDetails: getRouteDetails,
			getBusLocations: getBusLocations
		};
	});
