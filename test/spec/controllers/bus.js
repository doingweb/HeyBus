'use strict';

describe('Controller: BusCtrl', function () {

  // load the controller's module
  beforeEach(module('HeyBusApp'));

  var BusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BusCtrl = $controller('BusCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
