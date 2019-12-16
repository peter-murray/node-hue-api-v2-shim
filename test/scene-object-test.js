'use strict';

const expect = require('chai').expect
  , SceneBuilder = require('..').scene
  ;

//TODO this is confused as to what if has Scene or Scene Builder

describe.skip('Scene', function () {

  let scene;

  beforeEach(function () {
    scene = SceneBuilder.create();
  });

  describe('creation', function () {

    it('should instantiate from an object', function () {
      const data = {
          name: 'my scene',
          lights: [2]
        }
        , scene = SceneBuilder.create(data)
        ;

      expect(scene).to.have.property('name', data.name);
      expect(scene).to.have.property('lights').with.members(['2']);
    });
  });

  describe('#withName()', function () {

    it('should set a name of \'node-scene\'', function () {
      scene.withName('node-scene');

      expect(scene).to.have.property('name', 'node-scene');
    });
  });

  describe('#withLights', function () {

    it('should set light IDs from an array', function () {
      var ids = [2, 3];
      scene.withLights(ids);

      expect(scene).to.have.property('lights').with.members(['2', '3']);
    });

    it('should set light IDs from an integer', function () {
      scene.withLights(1);
      expect(scene).to.have.property('lights').with.members(['1']);
    });

    it('should set the light IDs from multiple integers', function () {
      scene.withLights(2, 3);
      expect(scene).to.have.property('lights').with.members(['2', '3']);
    });
  });

  describe('#withTransitionTime', function () {

    it('should set a transition time value of 5000', function () {
      scene.withTransitionTime(5000);

      expect(scene).to.have.property('transitiontime', 5000);
    });
  });

  describe('#withPicture()', function () {

    it('should set a picture', function () {
      var pictureData = 'ABC123DEF456';
      scene.withPicture(pictureData);

      expect(scene).to.have.property('picture', pictureData);
    });
  });

  describe('#withAppData()', function () {

    it('should set data', function () {
      var data = 'My App Data';
      scene.withAppData(data);

      expect(scene).to.have.property('appdata');
      expect(scene.appdata).to.have.property('data', data);
      expect(scene.appdata).to.have.property('version', 1);
    });
  });

  describe('#withRecycle()', function() {

    it ('should set the recycle flag', function() {
      scene.withRecycle(false);

      expect(scene).to.have.property('recycle');
      expect(scene).to.have.property('recycle').to.be.false;
    });
  });

  describe('with chained functions', function() {

    it('should createGroup a complex scene', function() {
      var name = 'a new scene'
        , pictureData = '1234556677A'
        ;

      scene.withName(name)
        .withLights(1)
        .withPicture(pictureData);

      expect(scene).to.have.property('name', name);
      expect(scene).to.have.property('lights').with.members(['1']);
      expect(scene).to.have.property('picture', pictureData);
    });
  });
});