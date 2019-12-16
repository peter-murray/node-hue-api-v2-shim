'use strict';

const expect = require('chai').expect
  , HueApi = require('..').HueApi
  , hueScene = require('..').scene
  , lightState = require('..').lightState
  , testValues = require('./support/testValues.js')
  ;

describe('Hue API', function () {

  this.timeout(6000);

  const hue = new HueApi(testValues.host, testValues.username);

  describe('get bridge scenes', function () {

    function validateScenesResult(scenes) {
      let scene;

      expect(scenes).to.be.instanceOf(Array);

      scene = scenes[0];
      expect(scene).to.have.property('id');
      expect(scene).to.have.property('name');
      expect(scene).to.have.property('lights').to.be.instanceOf(Array);
      expect(scene).to.have.property('owner');
      expect(scene).to.have.property('locked');
      expect(scene).to.have.property('lastupdated');
      expect(scene).to.have.property('picture');
      expect(scene).to.have.property('appdata');
    }

    async function testPromise(fnName) {
      const scenes = await hue[fnName].call(hue);
      validateScenesResult(scenes);
    }

    function testCallback(fnName, done) {
      hue[fnName].apply(hue, [function (err, result) {
        expect(err).to.be.null;
        validateScenesResult(result);
        done();
      }
      ]);
    }

    describe('#scenes', function () {

      it('using #promise', async () => {
        await testPromise('scenes');
      });

      it('using #callback', function (done) {
        testCallback('scenes', done);
      });
    });

    describe('#getScenes', function () {

      it('using #promise', async () => {
        await testPromise('getScenes');
      });

      it('using #callback', function (done) {
        testCallback('getScenes', done);
      });
    });
  });

  //TODO need to test getting a scene, but one we create
  // describe('get a scene', function () {
  //
  //   describe('#scene()', function () {
  //
  //     var sceneId = testValues.validScene.id;
  //
  //     function validateResult(cb) {
  //       return function (result) {
  //         expect(result).to.exist;
  //
  //         expect(result).to.have.property('id', sceneId);
  //         expect(result).to.have.property('name', testValues.validScene.name);
  //         expect(result).to.have.property('lights');
  //         expect(result.lights).to.be.instanceOf(Array);
  //
  //         cb();
  //       };
  //     }
  //
  //     it('using #promise', function (done) {
  //       hue.scene(sceneId)
  //         .then(validateResult(done))
  //         .done();
  //     });
  //
  //     it('using #callback', function (done) {
  //       hue.scene(sceneId, function (err, result) {
  //         expect(err).to.be.null;
  //
  //         validateResult(done)(result);
  //       });
  //     });
  //   });
  //
  //   describe('#getScene()', function () {
  //     var sceneId = testValues.validScene.id;
  //
  //     function validateResult(cb) {
  //       return function (result) {
  //         expect(result).to.exist;
  //
  //         expect(result).to.have.property('id', sceneId);
  //         expect(result).to.have.property('name', testValues.validScene.name);
  //         expect(result).to.have.property('lights');
  //         expect(result.lights).to.be.instanceof(Array);
  //         expect(result.lights).to.have.members(testValues.validScene.lights);
  //
  //         cb();
  //       };
  //     }
  //
  //     it('using #promise', function (done) {
  //       hue.getScene(sceneId)
  //         .then(validateResult(done))
  //         .done();
  //     });
  //
  //     it('using #callback', function (done) {
  //       hue.getScene(sceneId, function (err, result) {
  //         expect(err).to.be.null;
  //
  //         validateResult(done)(result);
  //       });
  //     });
  //   });
  // });


  describe('create scene', function () {

    describe.skip('#createScene() with 1.2.x compatibility', function () {

      const name = 'node-hue-test-scene'
        , lightIds = ['1', '2']
        ;

      describe('with name and lights', function () {

        function validateResult(cb) {
          return function (result) {
            expect(result).to.have.property('id');
            cb();
          };
        }

        it('using #promise', function (done) {
          const scene = new Scene();
          scene.name = name;
          scene.lights = lightIds;

          hue.createScene(scene)
            .then(validateResult(done))
            .done();
        });

        it('using #callback', function (done) {
          const scene = new Scene();
          scene.name = name;
          scene.lights = lightIds;

          hue.createScene(scene, function (err, result) {
            expect(err).to.be.null;
            validateResult(done)(result);
          });
        });
      });
    });

    describe('#createScene() with 1.11.x compatibility', function () {

      describe('with name, lights and transition', function () {

        const name = 'node-hue-scene-with-transition'
          , lightIds = ['2']
          , transitionTime = 1000
          , scene = hueScene.create()
            .withName(name)
            .withLights(lightIds)
            .withTransitionTime(transitionTime)
            .getScene()
          ;

        function validateScene(cb) {
          return function (createdScene) {
            expect(createdScene).to.have.property('name', name);
            expect(createdScene).to.have.property('lights').with.members(lightIds);
            expect(createdScene).to.have.property('version', 2);

            expect(createdScene).to.have.property('lightstates');
            expect(createdScene.lightstates).to.have.property(2);
            //TODO investigate if this is still relevant as it is not working
            // expect(createdScene.lightstates[2]).to.have.property('transitiontime', transitionTime);

            cb();
          };
        }

        it('using #promise', function (done) {
          hue.createScene(scene)
            .then(function (createdScene) {
              expect(createdScene).to.have.property('id');
              return hue.getScene(createdScene.id);
            })
            .then(validateScene(done))
            .done();
        });

        it('using #callback', function (done) {
          hue.createScene(scene, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.have.property('id');

            hue.scene(result.id, function (err, createdScene) {
              expect(err).to.be.null;
              validateScene(done)(createdScene);
            });
          });
        });
      });
    });
  });


  describe('modifying/updating scenes', function () {

    var originalName = 'nha-00'
      , originalLightIds = [2, 3]
      , scene = hueScene.create().withName(originalName).withLights(originalLightIds).getScene()
      , sceneId
      ;

    beforeEach(function (done) {
      hue.createScene(scene)
        .then(function (createdScene) {
          sceneId = createdScene.id;
          done();
        })
        .done();
    });

    afterEach(function(done) {
      hue.deleteScene(sceneId)
        .then(function() {
          done();
        })
        .done();
    });

    describe('#modifyScene()', function () {

      this.timeout(6000);

      describe.skip('update name', function () {

        let updateScene = hueScene.create({name: 'nha-01'});

        function validateResult(cb) {
          return function (result) {
            expect(result).to.exist;
            expect(result).to.have.property('name', true);
            cb();
          };
        }

        it('using #promise', function (done) {
          hue.updateScene(sceneId, updateScene)
            .then(validateResult(done))
            .done();
        });

        it('using #callback', function (done) {
          hue.updateScene(sceneId, updateScene, function (err, result) {
            expect(err).to.be.null;
            validateResult(done)(result);
          });
        });
      });

      describe('update lights', function() {

        var updateScene = hueScene.create({lights: [4, 5, 6]});

        function validateResult(cb) {
          return function (result) {
            expect(result).to.exist;
            expect(result).to.have.property('lights', true);
            cb();
          };
        }

        it('using #promise', function (done) {
          hue.updateScene(sceneId, updateScene)
            .then(validateResult(done))
            .done();
        });

        it('using #callback', function (done) {
          hue.updateScene(sceneId, updateScene, function (err, result) {
            expect(err).to.be.null;
            validateResult(done)(result);
          });
        });
      });

      //TODO this no longer functions as part of breaking changes to API
      // describe('update scene states to \'current\'', function () {
      //
      //   function validateResult(cb) {
      //     return function (result) {
      //       expect(result).to.exist;
      //       expect(result).to.have.property('storelightstate', true);
      //       cb();
      //     };
      //   }
      //
      //   it('using #promise', function (done) {
      //     hue.updateScene(sceneId, null, true)
      //       .then(validateResult(done))
      //       .done();
      //   });
      //
      //   it('using #callback', function (done) {
      //     hue.updateScene(sceneId, {}, true, function (err, result) {
      //       expect(err).to.be.null;
      //       validateResult(done)(result);
      //     });
      //   });
      // });

      describe('update name and lights', function () {

        var updateScene = hueScene.create({name: 'nha-01', lights: [2]});

        function validateResult(cb) {
          return function (result) {
            expect(result).to.exist;
            expect(result).to.have.property('name', true);
            expect(result).to.have.property('lights', true);
            cb();
          };
        }

        it('using #promise', function (done) {
          hue.updateScene(sceneId, updateScene)
            .then(validateResult(done))
            .done();
        });

        it('using #callback', function (done) {
          hue.updateScene(sceneId, updateScene, function (err, result) {
            expect(err).to.be.null;
            validateResult(done)(result);
          });
        });
      });
    });
  });


  describe('modifying scene light states', function () {

    describe('#modifySceneLightState()', function () {

      var originalName = 'nha-05'
        , originalLightIds = [2]
        , lightId = 2
        , scene = hueScene.create().withName(originalName).withLights(originalLightIds).getScene()
        , sceneId
        ;

      beforeEach(function (done) {
        hue.createScene(scene)
          .then(function (createdScene) {
            sceneId = createdScene.id;
            setTimeout(done, 1000);
          })
          .done();
      });

      afterEach(function(done) {
        hue.deleteScene(sceneId)
          .then(function() {
            done();
          })
          .done();
      });

      describe('update existing', function () {

        it('using #promise', function (done) {
          var state = lightState
            .create()
            .on()
            .hue(0);

          hue.modifySceneLightState(sceneId, lightId, state)
            .then(function (results) {
              expect(results).to.have.property('on', true);
              expect(results).to.have.property('hue', true);

              done();
            })
            .done();
        });

        it('using #callback', function (done) {
          var state = lightState
            .create()
            .on()
            .hue(10000);

          hue.setSceneLightState(sceneId, 2, state, function (err, results) {
            expect(err).to.be.null;

            expect(results).to.have.property('on', true);
            expect(results).to.have.property('hue', true);

            done();
          });
        });
      });
    });
  });


  describe('activating scenes', function () {

    this.timeout(6000);

    describe('#activateScene()', function () {

      var scene = hueScene.create().withName('activationTest').withLights([41]).getScene()
        , sceneId
        ;

      before(function (done) {
        hue.createScene(scene)
          .then(function (createdScene) {
            sceneId = createdScene.id;
            done();
          })
          .done();
      });

      after(function(done) {
        hue.deleteScene(sceneId)
          .then(function() {
            done();
          })
          .done();
      });

      it('using #promise', function (done) {
        hue.activateScene(sceneId)
          .then(function (result) {
            expect(result).to.be.true;
            done();
          })
          .done();
      });

      it('using #callback', function (done) {
        hue.activateScene(sceneId, function (err, result) {
          expect(err).to.be.null;
          expect(result).to.be.true;
          done();
        });
      });
    });
  });

  //TODO need more tests
});