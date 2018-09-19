import * as actions from "../actions";
import { GET_MESSAGES, REMOVE_MESSAGE, HIDE_UNDO } from "../constants";

describe("check the actions", () => {
  it("only returns the type for hiding the undo widget", () => {
    expect(actions.hideUndo(10, "fluffiness", "whatever")).toEqual({
      type: HIDE_UNDO
    });
  });
  it("only returns the type for hiding the undo widget", () => {
    expect(actions.hideUndo()).toEqual({
      type: HIDE_UNDO
    });
  });
  it("returns a proper payload for getting messages", () => {
    expect(actions.getMessages(1, "newToken")).toEqual({
      type: GET_MESSAGES,
      payload: {
        limit: 1,
        pageToken: "newToken"
      }
    });
  });
  it("returns a proper payload for getting messages", () => {
    expect(actions.getMessages(10, "anotherToken", "whatever")).toEqual({
      type: GET_MESSAGES,
      payload: {
        limit: 10,
        pageToken: "anotherToken"
      }
    });
  });
  it("returns a proper payload for removing messages", () => {
    expect(actions.removeMessage(1, "remover")).toEqual({
      type: REMOVE_MESSAGE,
      index: 1
    });
  });
  it("returns a proper payload for removing messages", () => {
    expect(actions.removeMessage()).toEqual({
      type: REMOVE_MESSAGE,
      index: undefined
    });
  });
});
