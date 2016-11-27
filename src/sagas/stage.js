import { fork, take, put, call } from 'redux-saga/effects';
import { PIECE_ADD, PIECE_MOVE, PIECE_RASTERIZE, RESTART, timeToggle, gameOver } from '../actions';
import { newPiece } from './piece';

function* triggerGameOver() {
  while (true) {
    yield take(PIECE_ADD);
    const { type } = yield take([PIECE_MOVE, PIECE_RASTERIZE]);
    if (type === PIECE_RASTERIZE) {
      yield put(timeToggle());
      yield put(gameOver());
    }
  }
}

function* restartStage() {
  while (true) {
    yield take(RESTART);
    yield call(newPiece);
    yield put(timeToggle());
  }
}

export default function* stageSaga() {
  yield fork(triggerGameOver);
  yield fork(restartStage);
}
