import { eventChannel } from 'redux-saga';
import { fork, take, put, cancel, cancelled } from 'redux-saga/effects';
import { TIME_RESUME, TIME_PAUSE, timeTick, timeResume } from '../actions';
import { PERIOD } from '../constants';

function createTimer(msec) {
  return eventChannel(emit => {
    let timer = setInterval(() => {
      emit(1);
    }, msec);
    return () => {
      clearInterval(timer);
    };
  });
}

function* runTimer(msec) {
  const timer = createTimer(msec);
  try {
    while (true) {
      yield take(timer);
      yield put(timeTick());
    }
  } finally {
    if (yield cancelled()) {
      timer.close();
    }
  }
}

function* handleTimer() {
  while (true) {
    yield take(TIME_RESUME);
    const timer = yield fork(runTimer, PERIOD);
    yield take(TIME_PAUSE);
    yield cancel(timer);
  }
}

export default function* timerSaga() {
  yield fork(handleTimer);
  yield put(timeResume());
}
