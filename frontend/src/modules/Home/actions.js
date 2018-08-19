import { GET_MESSAGES, REMOVE_MESSAGE, HIDE_UNDO } from "./constants";

export function getMessages(limit, pageToken) {
	return {
		type: GET_MESSAGES,
		payload: { limit, pageToken }
	};
}

export function removeMessage(index) {
	return {
		type: REMOVE_MESSAGE,
		index
	};
}

export function hideUndo() {
	return {
		type: HIDE_UNDO
	};
}
