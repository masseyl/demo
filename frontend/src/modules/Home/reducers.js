import {
	GET_MESSAGES,
	GET_MESSAGES_SUCCESS,
	GET_MESSAGES_FAIL,
	ON_PROGRESS,
	REMOVE_MESSAGE,
	UNDO_REMOVE_MESSAGE
} from "./constants";

let INITIAL_STATE = {
	messages: [],
	count: 0
};

const moduleReducer = (state = INITIAL_STATE, action) => {
	let newState = { ...state };
	let messages = [...newState.messages];
	// let messages = Immutable.asMutable(newState.messages);
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

		case UNDO_REMOVE_MESSAGE:
			newState.removingMessage = false;

			return newState;

		case REMOVE_MESSAGE:
			messages = [
				...messages.slice(0, action.index),
				...messages.slice(action.index + 1)
			];
			newState.messages = messages;
			newState.count -= 1;
			newState.removingMessage = true;

			return newState;

		default:
			return state;
	}
};

export default moduleReducer;
