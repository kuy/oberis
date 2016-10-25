const assert = require('assert');
import { zip, merge, rasterize, to1D, to3D, isValid } from '../../src/utils';

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
      const dim = [2, 2, 2];
      const piece = { type: 1, position: [1, 1, 0] };
      assert.deepStrictEqual(rasterize(dim, piece), [0, 0, 0, 1, 0, 0, 0, 0]);
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
});
