'use strict';

describe('Service: elementos', function () {

  // load the service's module
  beforeEach(module('diagramasApp'));

  // instantiate service
  var elementos;
  beforeEach(inject(function (_elementos_) {
    elementos = _elementos_;
  }));

  it('should do something', function () {
    expect(!!elementos).toBe(true);
  });

});
