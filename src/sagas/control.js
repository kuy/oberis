import { fork, put } from 'redux-saga/effects';
import { takeEvery, eventChannel } from 'redux-saga';
import { inputKey } from '../actions';

function createKeyChannel() {
  return eventChannel(emit => {
    function down(ev) {
      emit(ev.key);
    }
    document.addEventListener('keydown', down, false);
    return () => {
      document.removeEventListener('keydown', down, false);
    };
  });
}

function* dispatchKey(name) {
  yield put(inputKey(name));
}

function* handleKeyInput() {
  const key = createKeyChannel();
  yield takeEvery(key, dispatchKey);
}

export default function* controlSaga() {
  yield fork(handleKeyInput);
}
