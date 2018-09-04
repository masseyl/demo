import { endpoints } from "../../config/defaults";

export const getMessages = async data => {
  let localOptions = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const url = `${endpoints.apiBase}messages?limit=${
    data.payload.limit
  }&pageToken=${data.payload.pageToken}`;
  const response = await fetch(url, localOptions);
  const json = await response.json();
  return json;
};
