import { call, put, all, takeEvery } from "redux-saga/effects";
import { getMessages } from "./api";
import {
	GET_MESSAGES,
	GET_MESSAGES_SUCCESS,
	GET_MESSAGES_FAIL
} from "./constants";

function* getMessagesSaga(data) {
	try {
		let response = yield call(getMessages, data);
		yield put({ type: GET_MESSAGES_SUCCESS, response });
	} catch (e) {
		yield put({ type: GET_MESSAGES_FAIL, e });
	}
}

function* rootSaga() {
	yield all([yield takeEvery(GET_MESSAGES, getMessagesSaga)]);
}

export default rootSaga;
