import { GET_MESSAGES, REMOVE_MESSAGE } from "./constants";

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
