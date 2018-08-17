import {
	GET_MESSAGES,
	GET_MESSAGES_SUCCESS,
	GET_MESSAGES_FAIL,
	ON_PROGRESS,
	REMOVE_MESSAGE
} from "./constants";
import Immutable from "seamless-immutable";

let INITIAL_STATE = {
	messages: [],
	count: 0
};

const moduleReducer = (state = INITIAL_STATE, action) => {
	let newState = Immutable.asMutable(state, { deep: true });
	let messages = Immutable.asMutable(newState.messages);
	switch (action.type) {
		case GET_MESSAGES_FAIL:
			newState.messagesLoaded = false;

			return newState;

		case GET_MESSAGES_SUCCESS:
			newState.count = action.response.count;
			newState.pageToken = action.response.pageToken;
			newState.messages = newState.messages.concat(action.response.messages);
			newState.messagesLoaded = true;

			return newState;

		case GET_MESSAGES_FAIL:
			return state;

		case REMOVE_MESSAGE:
			messages.splice(action.index, 1);
			newState.messages = messages;
			newState.count -= 1;
			return newState;

		default:
			return state;
	}
};

export default moduleReducer;
