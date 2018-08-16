import { NAME_SPACE } from "./constants";
import { API_URL } from "../../config";

const path = "/";
const options = {
	headers: {
		"Content-Type": "application/json"
	}
};

export const getMessages = async data => {
	let localOptions = {
		headers: {
			"Content-Type": "application/json"
		}
	};
	const url = `${API_URL}messages?limit=${data.payload.limit}&pageToken=${
		data.payload.pageToken
	}`;
	const response = await fetch(url, localOptions);
	const json = await response.json();
	return json;
};
