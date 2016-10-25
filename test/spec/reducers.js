const assert = require('assert');
import reducers, { initial } from '../../src/reducers';
import { score, timeTick } from '../../src/actions';

describe('reducers', () => {
  describe('app', () => {
    it('increases score', () => {
      let state = reducers(initial.app, score(100));
      assert(state.app.score === 100);

      state = reducers(state, score(50))
      assert(state.app.score === 150);

      state = reducers(state, score(0))
      assert(state.app.score === 150);
    });

    it('increases time', () => {
      let state = reducers(initial.app, timeTick());
      assert(state.app.time === 1);

      state = reducers(state, timeTick())
      assert(state.app.time === 2);
    });
  });
});
