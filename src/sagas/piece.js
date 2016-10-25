import { fork, take, put, select, cancel, cancelled } from 'redux-saga/effects';
import {
  TIME_RESUME, TIME_PAUSE, TIME_TICK, timeTick, timeResume,
  pieceAdd, pieceRasterize,
} from '../actions';
import { rand } from '../utils';

function* newPiece(type = 1) {
  const [dx, dy, dz] = yield select(state => state.stage.size);
  yield put(pieceAdd({ type, position: [rand(dx), rand(dy), dz] }));
}

function* handlePiece() {
  while (true) {
    yield take(TIME_TICK);
    const { type, position, rotate } = yield select(state => state.piece);
    if (typeof type !== 'undefined') {
      const [x, y, z] = position;
      if (z <= 0) {
        yield put(pieceRasterize({ type, position, rotate }));
        yield fork(newPiece);
      }
    }
  }
}

export default function* pieceSaga() {
  yield fork(handlePiece);
  yield fork(newPiece);
}
