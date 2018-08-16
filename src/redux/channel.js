import { call, put, all, fork, take, takeEvery } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";

const ON_PROGRESS = "ON_PROGRESS";

//channel functions
export const identity = a => a;

export function* progressListener(chan) {
	while (true) {
		const data = yield take(chan);
		yield put({ type: ON_PROGRESS, payload: data });
	}
}

export function percenter(event, emit) {
	if (event.lengthComputable) {
		var percent = Math.round((event.loaded / event.total) * 100);
		if (percent <= 99) {
			emit(percent);
		} else {
			emit(END);
		}
	}
}

export function makeChannel() {
	let emit;
	const chan = eventChannel(emitter => {
		emit = emitter;
		return () => {};
	});
	return [emit, chan];
}
