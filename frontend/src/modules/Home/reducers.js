import moment from "moment";
import {
	GET_MESSAGES,
	GET_MESSAGES_SUCCESS,
	GET_MESSAGES_FAIL,
	HIDE_UNDO,
	REMOVE_MESSAGE
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
		case GET_MESSAGES:
			newState.messagesLoaded = false;

			return newState;

		case GET_MESSAGES_SUCCESS:
			newState.count = action.response.count;
			newState.pageToken = action.response.pageToken;
			messages = messages.concat(action.response.messages);
			messages.sort((a, b) => {
				if (moment(a.updated).isSame(b.updated)) return 0;
				if (moment(a.updated).isBefore(b.updated)) return -1;
				return 1;
			});
			newState.messages = messages;
			newState.messagesLoaded = true;

			return newState;

		case GET_MESSAGES_FAIL:
			newState.messagesLoaded = true;
			return newState;

		case HIDE_UNDO:
			newState.undoable = false;

			return newState;

		case REMOVE_MESSAGE:
			messages = [
				...messages.slice(0, action.index),
				...messages.slice(action.index + 1)
			];
			newState.messages = messages;
			newState.count -= 1;
			newState.undoable = true;

			return newState;

		default:
			return state;
	}
};

export default moduleReducer;
