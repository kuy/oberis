import { combineReducers } from 'redux';
import {
  SCORE, TIME_TICK,
  PIECE_ADD, PIECE_MOVE, PIECE_ROTATE, PIECE_RASTERIZE,
} from './actions';
import { merge, rasterize, empty, isValid, move } from './utils';
import { DIMENSION } from './constants';

export const initial = {
  app: {
    score: 0,
    time: 0,
  },
  stage: {
    size: DIMENSION,
    data: [],
  },
  piece: {
    type: undefined,
    position: undefined,
    rotate: undefined,
  }
};

const handlers = {
  app: {
    [SCORE]: (state, { payload }) => {
      return { ...state, score: state.score + payload };
    },
    [TIME_TICK]: state => {
      return { ...state, time: state.time + 1 };
    },
  },
  stage: {
    [TIME_TICK]: state => {
      if (isValid(state.size, state.data)) {
        return state;
      } else {
        // TODO: Don't reset stage when resized
        return { ...state, data: empty(state.size) };
      }
    },
    [PIECE_RASTERIZE]: (state, { payload }) => {
      const piece = rasterize(state.size, payload);
      return { ...state, data: merge(state.data, piece) };
    },
  },
  piece: {
    [PIECE_ADD]: (state, { payload }) => {
      return { ...initial.piece, ...payload };
    },
    [PIECE_MOVE]: (state, { payload: dir }) => {
      return move(state, dir);
    },
    [PIECE_RASTERIZE]: state => {
      return initial.piece;
    },
    [TIME_TICK]: state => {
      if (typeof state.type !== 'undefined') {
        const [x, y, z] = state.position;
        return { ...state, position: [x, y, z - 1] };
      } else {
        return state;
      }
    },
  },
};

function createHandler(name) {
  return (state = initial[name], action) => {
    const handler = handlers[name][action.type];
    if (!handler) { return state; }
    return handler(state, action);
  };
}

export const app = createHandler('app');
export const stage = createHandler('stage');
export const piece = createHandler('piece');

export default combineReducers(
  { app, stage, piece }
);
