import { fork } from 'redux-saga/effects';
import timer from './timer';
import stage from './stage';
import piece from './piece';

export default function* rootSaga() {
  yield fork(timer);
  yield fork(stage);
  yield fork(piece);
}
