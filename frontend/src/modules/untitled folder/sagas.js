// import { call, put, all, fork, take, takeEvery } from "redux-saga/effects";
// import {
// 	identity,
// 	emit,
// 	progressListener,
// 	percenter,
// 	makeChannel
// } from "../../redux/channel";
// import { uploadSessions } from "./api";
// import {
// 	UPLOAD_SESSIONS,
// 	UPLOAD_SESSIONS_SUCCESS,
// 	UPLOAD_SESSIONS_FAIL,
// 	ON_PROGRESS
// } from "./constants";
//
// function createAsync(data) {
// 	let [emit, chan] = makeChannel();
// 	const promise = uploadSessions(data, event => {
// 		percenter(event, emit);
// 	});
// 	return [promise, chan];
// }
//
// function* uploadSessionsSaga(data) {
// 	try {
// 		const [promise, chan] = createAsync(data);
// 		yield fork(progressListener, chan);
// 		let response = yield call(identity, promise);
// 		yield put({ type: UPLOAD_SESSIONS_SUCCESS, response });
// 	} catch (e) {
// 		yield put({ type: UPLOAD_SESSIONS_FAIL, e });
// 	}
// }
//
// function* rootSaga() {
// 	yield all([yield takeEvery(UPLOAD_SESSIONS, uploadSessionsSaga)]);
// }
//
// export default rootSaga;
