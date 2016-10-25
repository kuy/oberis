import { fork } from 'redux-saga/effects';
import timer from './timer';
import stage from './stage';
import piece from './piece';
import control from './control';

export default function* rootSaga() {
  yield fork(timer);
  yield fork(stage);
  yield fork(piece);
  yield fork(control);
}
