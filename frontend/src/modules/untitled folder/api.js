import { NAME_SPACE } from "./constants";
import { API_URL } from "../../config";

const path = "/";
const options = {
	headers: {
		"Content-Type": "application/json"
	}
};

export const upload = async (data, onProgress) => {
	let localOptions = {
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify(data.allSessions)
	};
	const response = await futch("${API_URL}upload", localOptions, onProgress);
	const json = await response.json();
	return json;
};
//POST with SAGA friendly Progress events
const futch = (url, options, onProgress) => {
	return new Promise((res, rej) => {
		var xhr = new XMLHttpRequest();
		xhr.open(options.method || "get", url);
		for (var k in options.headers || {})
			xhr.setRequestHeader(k, options.headers[k]);
		xhr.onload = e => {
			const response = {
				responseText: JSON.parse(e.target.responseText),
				options: options //to hand back anything created locally
			};
			return res(response);
		};
		xhr.onerror = rej;
		if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress;
		xhr.send(options.body);
	});
};
