'use strict';

var expect = require('chai').expect
  , HueApi = require('..').api
  , testValues = require('./support/testValues.js')
;

describe('Hue API', function () {

  const hue = new HueApi(testValues.host, testValues.username);

  describe('#setLightName', function () {

    let originalName
      , lightId
    ;

    before(async () => {
      const lightsResult = await hue.lights()
        , lights = lightsResult.lights
      ;

      const light = lights[lights.length - 1];
      lightId = light.id;
      originalName = light.id;
    });

    after(async () => {
      await hue.setLightName(lightId, originalName);
    });

    describe('#promise', function () {

      it('should set name', function (done) {

        function checkResults(results) {
          _validateLightsResult(results, done);
        }

        hue.setLightName(lightId, 'A New Name').then(checkResults).done();
      });
    });

    describe('#callback', function () {

      it('should set name', function (done) {

        hue.setLightName(lightId, 'Another New Name', function (err, results) {
          if (err) {
            throw err;
          }

          _validateLightsResult(results, done);
        });
      });
    });
  });
});

function _validateLightsResult(result, cb) {
  expect(result).to.be.true;
  cb();
}