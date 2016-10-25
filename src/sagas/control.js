import { fork, take, put, select, cancel, cancelled } from 'redux-saga/effects';
import { takeEvery, eventChannel } from 'redux-saga';
import { INPUT_KEY, inputKey, pieceMove } from '../actions';
import { zip, move } from '../utils';

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

function canMove(dim, pos, dir) {
  const newPos = move(pos, dir);
  return 0 <= newPos[0] && 0 <= newPos[1] && 0 <= newPos[2] &&
    newPos[0] < dim[0] && newPos[1] < dim[1] && newPos[2] < dim[2];
}

function* chainKeyToMove() {
  while (true) {
    const { payload: key } = yield take(INPUT_KEY);
    const [size, position] = yield select(state => [state.stage.size, state.piece.position]);
    let action;
    switch (key) {
      case 'ArrowUp':
        if (canMove(size, position, 'up')) {
          yield put(pieceMove('up'));
        }
        break;
      case 'ArrowRight':
        if (canMove(size, position, 'right')) {
          yield put(pieceMove('right'));
        }
        break;
      case 'ArrowDown':
        if (canMove(size, position, 'down')) {
          yield put(pieceMove('down'));
        }
        break;
      case 'ArrowLeft':
        if (canMove(size, position, 'left')) {
          yield put(pieceMove('left'));
        }
        break;
    }
  }
}

export default function* controlSaga() {
  yield fork(handleKeyInput);
  yield fork(chainKeyToMove);
}
