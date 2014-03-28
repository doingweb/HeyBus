'use strict';

angular.module('HeyBusApp')
	.factory('transitData', function ($q) {
		var
			fixture = {
				routes: [
					{
						id: 0,
						shortName: 'first route',
						longName: 'the first route'
					}, {
						id: 1,
						shortName: 'second route',
						longName: 'the second route'
					}
				],
				routeDetails: {
					0: {
						busGroup: 10,
						color: '#0AA',
						path: [
							{latitude:46.7324753275752,longitude:-117.165824621916},
							{latitude:46.7328374914458,longitude:-117.165972143412},
							{latitude:46.7330636128323,longitude:-117.16633155942},
							{latitude:46.7332456122839,longitude:-117.166513949633},
							{latitude:46.7333136321234,longitude:-117.166551500559},
							{latitude:46.733390843729,longitude:-117.166519314051},
							{latitude:46.7334386413343,longitude:-117.166476398706},
							{latitude:46.7334064698738,longitude:-117.165756225586},
							{latitude:46.733369702467,longitude:-117.165002524853},
							{latitude:46.7333237431733,longitude:-117.164047658443},
							{latitude:46.7333136321234,longitude:-117.163702994585},
							{latitude:46.7333071978179,longitude:-117.16310352087},
							{latitude:46.7334570250173,longitude:-117.162203639746},
							{latitude:46.733580195532,longitude:-117.162072211504},
							{latitude:46.7336500533109,longitude:-117.161943465471},
							{latitude:46.7338770904673,longitude:-117.161545157433},
							{latitude:46.7339864723998,longitude:-117.16140165925},
							{latitude:46.7347254840133,longitude:-117.160280495882},
							{latitude:46.7349157502894,longitude:-117.160037755966},
							{latitude:46.7352429699479,longitude:-117.159697115421}
						],
						stops: [
							{id:31,name:'Merman and Terre View',latitude:46.7432583123372,longitude:-117.154739052057},
							{id:35,name:'Merman at Cougar Crest',latitude:46.7465179668294,longitude:-117.151524424553},
							{id:36,name:'Merman at Pine Ridge',latitude:46.7477080086534,longitude:-117.150855213404},
							{id:41,name:'Northwood at Aspen Village',latitude:46.7442692214796,longitude:-117.148146182299},
							{id:46,name:'Orchard at Beasley (NE)',latitude:46.7356519917287,longitude:-117.15911641717},
							{id:47,name:'Orchard At WSU Rec. Center ',latitude:46.7366887791081,longitude:-117.156635373831}
						]
					},
					1: {
						busGroup: 11,
						color: '#A0A',
						path: [
							{latitude:46.7353422384405,longitude:-117.159563004971},
							{latitude:46.7353826811073,longitude:-117.159514725208},
							{latitude:46.7355757025083,longitude:-117.15931892395},
							{latitude:46.7356519917287,longitude:-117.15911641717},
							{latitude:46.73592,longitude:-117.158702},
							{latitude:46.736102,longitude:-117.157452},
							{latitude:46.7366887791081,longitude:-117.156635373831},
							{latitude:46.73754,longitude:-117.155789},
							{latitude:46.738779,longitude:-117.155671},
							{latitude:46.739632,longitude:-117.155397},
							{latitude:46.73975,longitude:-117.15544},
							{latitude:46.739868,longitude:-117.155681},
							{latitude:46.7399166632292,longitude:-117.156168669462},
							{latitude:46.7399139060074,longitude:-117.157100737095},
							{latitude:46.7399249348935,longitude:-117.1575781703},
							{latitude:46.7400205184788,longitude:-117.157964408398},
							{latitude:46.740100477694,longitude:-117.158207148314},
							{latitude:46.7403679266211,longitude:-117.159447669983},
							{latitude:46.741485499536,longitude:-117.158267498016},
							{latitude:46.7424697900467,longitude:-117.157201319933}
						],
						stops: [
							{id:41,name:'Northwood at Aspen Village',latitude:46.7442692214796,longitude:-117.148146182299},
							{id:46,name:'Orchard at Beasley (NE)',latitude:46.7356519917287,longitude:-117.15911641717},
							{id:47,name:'Orchard At WSU Rec. Center ',latitude:46.7366887791081,longitude:-117.156635373831},
							{id:58,name:'Spokane and College',latitude:46.7290649850565,longitude:-117.168683856726},
							{id:59,name:'Spokane and Washington',latitude:46.727675047765,longitude:-117.168552428484},
							{id:62,name:'Spokane at Honors Hall',latitude:46.7315101581749,longitude:-117.16839954257}
						]
					}
				},
				busLocations: {
					10: [
						{
							id: 'imaginary bus 1',
							group: 10,
							location: {
								latitude: 46.7316,
								longitude: -117.1685
							}
						}, {
							id: 'imaginary bus 2',
							group: 10,
							location: {
								latitude: 46.7326,
								longitude: -117.1659
							}
						}
					],
					11: [
						{
							id: 'imaginary bus 3',
							group: 11,
							location: {
								latitude: 46.7320,
								longitude: -117.1600
							}
						}
					]
				}
			};

		function getRoutes () {
			return $q.when(fixture.routes);
		}

		function getRouteDetails (routeId) {
			return $q.when(fixture.routeDetails[routeId]);
		}

		function getBusLocations (busGroup) {
			return $q.when(fixture.busLocations[busGroup]);
		}

		return {
			fixture: fixture,
			getRoutes: getRoutes,
			getRouteDetails: getRouteDetails,
			getBusLocations: getBusLocations
		};
	});
