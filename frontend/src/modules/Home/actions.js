import { GET_MESSAGES } from "./constants";

export function getMessages(limit, pageToken) {
	return {
		type: GET_MESSAGES,
		payload: { limit, pageToken }
	};
}
