import { eventChannel } from 'redux-saga';
import { fork, take, put, cancel, cancelled } from 'redux-saga/effects';
import { INPUT_KEY, TIME_TOGGLE, timeTick, timeToggle } from '../actions';
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
    yield take(TIME_TOGGLE);
    const timer = yield fork(runTimer, PERIOD);
    yield take(TIME_TOGGLE);
    yield cancel(timer);
  }
}

function* controlByKeys() {
  while (true) {
    const { payload: key } = yield take(INPUT_KEY);
    switch (key) {
      case ' ': // Space key
        yield put(timeToggle());
        break;
    }
  }
}

export default function* timerSaga() {
  yield fork(handleTimer);
  yield fork(controlByKeys);

  // Start time
  yield put(timeToggle());
}
