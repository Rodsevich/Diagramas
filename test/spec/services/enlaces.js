'use strict';

describe('Service: enlaces', function () {

  // load the service's module
  beforeEach(module('diagramasApp'));

  // instantiate service
  var enlaces;
  beforeEach(inject(function (_enlaces_) {
    enlaces = _enlaces_;
  }));

  it('should do something', function () {
    expect(!!enlaces).toBe(true);
  });

});
