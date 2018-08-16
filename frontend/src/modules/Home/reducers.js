import {
	GET_MESSAGES,
	GET_MESSAGES_SUCCESS,
	GET_MESSAGES_FAIL,
	ON_PROGRESS
} from "./constants";
import Immutable from "seamless-immutable";

let INITIAL_STATE = {
	messages: []
};

const moduleReducer = (state = INITIAL_STATE, action) => {
	let newState = Immutable.asMutable(state, { deep: true });
	switch (action.type) {
		case GET_MESSAGES_SUCCESS:
			newState.uploading = [];
			newState.pageToken = action.payload.pageToken;
			newState.messages = newState.messages.concat(action.payload.messages);

			return newState;

		case GET_MESSAGES_FAIL:
			newState.uploading = [];
			newState.progress = 0;

			return newState;

		default:
			return state;
	}
};

export default moduleReducer;
