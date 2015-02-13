'use strict';

describe('Directive: conector', function () {

  // load the directive's module
  beforeEach(module('diagramasApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<conector></conector>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the conector directive');
  }));
});
