const assert = require('assert');
import { zip, merge, rasterize, to1D, to3D, isValid, isGrounded, range, eachCubes, isExist, empty, sliceX, sliceY, sliceZ, shrink } from '../../src/utils';

describe('utils', () => {
  describe('zip', () => {
    it('should make pairs', () => {
      assert.deepStrictEqual(zip([0, 1, 2], ['a', 'b', 'c']), [[0, 'a'], [1, 'b'], [2, 'c']]);
    });
  });

  describe('merge', () => {
    it('should merge two array', () => {
      assert.deepStrictEqual(merge([0, 0, 1, 1], [1, 0, 0, 0]), [1, 0, 1, 1]);
    });
  });

  describe('rasterize', () => {
    it('should fill with piece', () => {
      assert.deepStrictEqual(rasterize([1, 1, 1], { type: 1, position: [0, 0, 0] }), [1]);
      assert.deepStrictEqual(rasterize([1, 1, 1], { type: 1, position: [1, 0, 0] }), [0]);
      assert.deepStrictEqual(rasterize([1, 1, 1], { type: 1, position: [0, 1, 0] }), [0]);
      assert.deepStrictEqual(rasterize([1, 1, 1], { type: 1, position: [0, 0, 1] }), [0]);

      assert.deepStrictEqual(rasterize([4, 2, 1], { type: 2, position: [0, 0, 0] }), [1, 1, 1, 1,
                                                                                      0, 0, 0, 0]);
      assert.deepStrictEqual(rasterize([4, 2, 1], { type: 2, position: [1, 0, 0] }), [0, 1, 1, 1,
                                                                                      0, 0, 0, 0]);

      // assert.deepStrictEqual(rasterize([2, 2, 2], { type: 1, position: [1, 1, 0] }), [0, 0, 0, 1, 0, 0, 0, 0]);
      // assert.deepStrictEqual(rasterize([3, 3, 3], { type: 1, position: [1, 1, 0] }), [0, 0, 0, 1, 0, 0, 0, 0]);
      // assert.deepStrictEqual(rasterize([4, 4, 4], { type: 1, position: [1, 1, 0] }), [0, 0, 0, 1, 0, 0, 0, 0]);
    });
  });

  describe('to1D', () => {
    it('should convert 3D to 1D', () => {
      // 2x2x2
      let dim = [2, 2, 2];
      let pos = [0, 0, 0];
      assert(to1D(dim, pos) === 0);

      pos = [1, 0, 1];
      assert(to1D(dim, pos) === 5);

      pos = [1, 1, 1];
      assert(to1D(dim, pos) === 7);

      // 2x3x4
      dim = [2, 3, 4];
      pos = [0, 0, 0];
      assert(to1D(dim, pos) === 0);

      pos = [1, 2, 1];
      assert(to1D(dim, pos) === 11);

      pos = [0, 1, 2];
      assert(to1D(dim, pos) === 14);

      pos = [1, 2, 3];
      assert(to1D(dim, pos) === 23);
    });
  });

  describe('to3D', () => {
    it('should convert 1D to 3D', () => {
      // 2x2x2
      let dim = [2, 2, 2];
      assert.deepStrictEqual(to3D(dim, 0), [0, 0, 0]);
      assert.deepStrictEqual(to3D(dim, 1), [1, 0, 0]);
      assert.deepStrictEqual(to3D(dim, 2), [0, 1, 0]);
      assert.deepStrictEqual(to3D(dim, 3), [1, 1, 0]);
      assert.deepStrictEqual(to3D(dim, 4), [0, 0, 1]);
      assert.deepStrictEqual(to3D(dim, 5), [1, 0, 1]);
      assert.deepStrictEqual(to3D(dim, 6), [0, 1, 1]);
      assert.deepStrictEqual(to3D(dim, 7), [1, 1, 1]);
    });
  });

  describe('isValid', () => {
    it('should validate stage and its dimension', () => {
      assert(isValid([2, 2, 2], [0, 0, 0, 0, 0, 0, 0, 0]));
      assert(isValid([3, 2, 1], [0, 0, 0, 0, 0, 0]));
      assert(isValid([3, 3, 3], [0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    });
  });

  describe('range', () => {
    it('should generate a list of 0 to the given number', () => {
      assert.deepStrictEqual(range(0), []);
      assert.deepStrictEqual(range(1), [0]);
      assert.deepStrictEqual(range(5), [0, 1, 2, 3, 4]);
      assert.deepStrictEqual(range(10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('eachCubes', () => {
    it('should iterate cubes from rasterized piece', () => {
      assert.deepStrictEqual(eachCubes([0, 1, 1], []), []);
      assert.deepStrictEqual(eachCubes([0, 1, 1], []), []);
      assert.deepStrictEqual(eachCubes([1, 1, 1], [0]), []);
      assert.deepStrictEqual(eachCubes([1, 1, 1], [1]), [[0, 0, 0]]);
      assert.deepStrictEqual(eachCubes([2, 2, 2], [0, 1, 0, 0, 1, 1, 0, 1]), [[1, 0, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1]]);
      assert.deepStrictEqual(eachCubes([3, 3, 3], [0, 0, 0, 0, 0, 0, 0, 0, 0,
                                                   0, 0, 0, 0, 0, 1, 0, 0, 0,
                                                   0, 0, 1, 0, 0, 1, 0, 0, 1]), [[2, 1, 1], [2, 0, 2], [2, 1, 2], [2, 2, 2]]);
    });
  });

  describe('empty', () => {
    it('should generate a zero-padding list based on given dimension', () => {
      assert.deepStrictEqual(empty([0, 0, 0]), []);
      assert.deepStrictEqual(empty([1, 1, 1]), [0]);
      assert.deepStrictEqual(empty([2, 2, 2]), [0, 0, 0, 0, 0, 0, 0, 0]);
      assert.deepStrictEqual(empty([1, 2, 3]), [0, 0, 0, 0, 0, 0]);
      assert.deepStrictEqual(empty([3, 2, 1]), [0, 0, 0, 0, 0, 0]);
      assert.deepStrictEqual(empty([3, 3, 3]), [0, 0, 0, 0, 0, 0, 0, 0, 0,
                                                0, 0, 0, 0, 0, 0, 0, 0, 0,
                                                0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe('sliceX', () => {
    it('should cut out a new volume from given volume based on x-axis range', () => {
      assert.deepStrictEqual(sliceX([2, 2, 1], [1, 0, 1, 0], [0, 1]), [1, 1]);
      assert.deepStrictEqual(sliceX([2, 2, 1], [1, 0, 1, 0], [1, 2]), [0, 0]);
      assert.deepStrictEqual(sliceX([2, 2, 2], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1]), [1, 1, 1, 1]);
      assert.deepStrictEqual(sliceX([2, 2, 2], [1, 0, 1, 0, 1, 0, 1, 0], [1, 2]), [0, 0, 0, 0]);
      assert.deepStrictEqual(sliceX([2, 2, 2], [1, 0, 1, 0, 1, 0, 1, 0], [0, 2]), [1, 0, 1, 0, 1, 0, 1, 0]);
      assert.deepStrictEqual(sliceX([4, 2, 1], [0, 1, 1, 0, 0, 1, 1, 0], [1, 3]), [1, 1, 1, 1]);
      assert.deepStrictEqual(sliceX([4, 2, 1], [0, 1, 1, 0, 0, 1, 1, 0], [2, 4]), [1, 0, 1, 0]);
      assert.deepStrictEqual(sliceX([3, 3, 3], [0, 0, 1, 0, 0, 0, 0, 0, 1,
                                                0, 0, 0, 0, 0, 1, 0, 0, 0,
                                                0, 0, 1, 0, 0, 0, 0, 0, 1], [2, 3]), [1, 0, 1, 0, 1, 0, 1, 0, 1]);
    });
  });

  describe('sliceY', () => {
    it('should cut out a new volume from given volume based on y-axis range', () => {
      assert.deepStrictEqual(sliceY([2, 2, 1], [1, 1, 0, 0], [0, 1]), [1, 1]);
      assert.deepStrictEqual(sliceY([2, 2, 1], [1, 1, 0, 0], [1, 2]), [0, 0]);
      assert.deepStrictEqual(sliceY([2, 2, 2], [1, 1, 0, 0, 1, 1, 0, 0], [0, 1]), [1, 1, 1, 1]);
      assert.deepStrictEqual(sliceY([2, 2, 2], [1, 1, 0, 0, 1, 1, 0, 0], [1, 2]), [0, 0, 0, 0]);
      assert.deepStrictEqual(sliceY([2, 2, 2], [1, 1, 0, 0, 1, 1, 0, 0], [0, 2]), [1, 1, 0, 0, 1, 1, 0, 0]);
      assert.deepStrictEqual(sliceY([2, 4, 1], [0, 0, 1, 1, 1, 1, 0, 0], [1, 3]), [1, 1, 1, 1]);
      assert.deepStrictEqual(sliceY([2, 4, 1], [0, 0, 1, 1, 1, 1, 0, 0], [2, 4]), [1, 1, 0, 0]);
      assert.deepStrictEqual(sliceY([3, 3, 3], [0, 0, 0, 0, 0, 0, 1, 1, 1,
                                                0, 0, 0, 0, 1, 0, 1, 0, 1,
                                                0, 0, 0, 0, 0, 0, 1, 1, 1], [2, 3]), [1, 1, 1, 1, 0, 1, 1, 1, 1]);
    });
  });

  describe('sliceZ', () => {
    it('should cut out a new volume from given volume based on z-axis range', () => {
      assert.deepStrictEqual(sliceZ([2, 2, 2], [1, 1, 1, 1, 0, 0, 0, 0], [0, 1]), [1, 1, 1, 1]);
      assert.deepStrictEqual(sliceZ([2, 2, 2], [1, 1, 1, 1, 0, 0, 0, 0], [1, 2]), [0, 0, 0, 0]);
      assert.deepStrictEqual(sliceZ([2, 2, 2], [1, 1, 1, 1, 0, 0, 0, 0], [0, 2]), [1, 1, 1, 1, 0, 0, 0, 0]);
      assert.deepStrictEqual(sliceZ([1, 2, 4], [0, 0, 1, 1, 1, 1, 0, 0], [1, 3]), [1, 1, 1, 1]);
      assert.deepStrictEqual(sliceZ([1, 2, 4], [0, 0, 1, 1, 1, 1, 0, 0], [2, 4]), [1, 1, 0, 0]);
      assert.deepStrictEqual(sliceZ([3, 3, 3], [0, 0, 0, 0, 0, 0, 0, 0, 0,
                                                0, 0, 0, 0, 1, 0, 0, 0, 0,
                                                1, 0, 0, 0, 1, 0, 0, 0, 1], [2, 3]), [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    });
  });

  describe('shrink', () => {
    it('should return a shrinked volume', () => {
      assert.deepStrictEqual(shrink([1, 1, 1], [0]), [0, 0, 0]);
      assert.deepStrictEqual(shrink([1, 1, 1], [1]), [1, 1, 1]);

      assert.deepStrictEqual(shrink([4, 2, 1], [0, 0, 0, 0, 0, 0, 0, 0]), [0, 0, 0]);
      assert.deepStrictEqual(shrink([4, 2, 1], [1, 0, 0, 0, 0, 0, 0, 0]), [1, 1, 1]);
      assert.deepStrictEqual(shrink([4, 2, 1], [1, 1, 0, 0, 0, 0, 0, 0]), [2, 1, 1]);
      assert.deepStrictEqual(shrink([4, 2, 1], [1, 1, 1, 0, 1, 0, 0, 0]), [3, 2, 1]);
      assert.deepStrictEqual(shrink([3, 3, 2], [0, 0, 0, 0, 0, 0, 0, 0, 0,
                                                1, 1, 1, 0, 0, 1, 0, 0, 0]), [3, 2, 1]);
      assert.deepStrictEqual(shrink([3, 3, 3], [0, 0, 0, 0, 0, 1, 0, 1, 1,
                                                0, 0, 0, 0, 0, 0, 0, 0, 1]), [2, 2, 2]);
    });
  });
});
