import moduleReducer from "../reducers";
import {
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  HIDE_UNDO,
  REMOVE_MESSAGE
} from "../constants";
import moment from "moment";

const INITIAL_STATE = {
  messages: []
};
let newState;
describe("check HIDE_UNDO", () => {
  it("returns a proper value for REMOVE_MESSAGE", () => {
    //set up new state
    newState = moduleReducer(INITIAL_STATE, { type: HIDE_UNDO });
    //bad date
    expect(newState).toEqual({
      messages: [],
      undoable: false
    });
  });
});

describe("check REMOVE_MESSAGE", () => {
  it("returns a proper value for REMOVE_MESSAGE", () => {
    const updated1 = moment();
    //quick add of messages
    let action1 = {
      type: GET_MESSAGES_SUCCESS,
      response: {
        pageToken: "newToken",
        messages: [
          { content: "first message", updated: updated1 },
          { content: "second message", updated: updated1 },
          { content: "third message", updated: updated1 }
        ]
      }
    };

    let action2 = {
      type: REMOVE_MESSAGE,
      index: 1
    };

    //set up new state
    newState = moduleReducer(INITIAL_STATE, action1);
    newState = moduleReducer(newState, action2);
    //bad date
    expect(newState).toEqual({
      messages: [
        { content: "first message", updated: updated1 },
        { content: "third message", updated: updated1 }
      ],
      pageToken: "newToken",
      messagesLoaded: true,
      undoable: true
    });
  });
});

describe("check GET_MESSAGES_FAIL", () => {
  it("returns a proper state for GET_MESSAGES", () => {
    //set up existing state
    expect(moduleReducer(INITIAL_STATE, { type: GET_MESSAGES_FAIL })).toEqual({
      messages: [],
      messagesLoaded: true
    });
  });
});

describe("check GET_MESSAGES", () => {
  it("returns a proper state for GET_MESSAGES", () => {
    let action = { type: GET_MESSAGES };
    expect(moduleReducer(INITIAL_STATE, action)).toEqual({
      messages: [],
      messagesLoaded: false
    });
  });
});

describe("check GET_MESSAGES_SUCCESS", () => {
  it("returns a proper state for GET_MESSAGES_SUCCESS", () => {
    const updated1 = moment();
    const updated2 = moment().add(1, "hour");

    let action1 = {
      type: GET_MESSAGES_SUCCESS,
      response: {
        pageToken: "newToken",
        messages: [
          { content: "first message", updated: updated1 },
          { content: "second message", updated: updated1 }
        ]
      }
    };
    let action2 = {
      type: GET_MESSAGES_SUCCESS,
      response: {
        pageToken: "secondToken",
        messages: [
          { content: "third message", updated: updated2 },
          { content: "fourth message", updated: updated2 }
        ]
      }
    };
    let action3 = {
      type: GET_MESSAGES_SUCCESS,
      response: {
        pageToken: "thirdToken",
        messages: [{ content: "fifth message", updated: updated2 }]
      }
    };
    //initial load & token
    newState = moduleReducer(INITIAL_STATE, action1);
    expect(newState).toEqual({
      messages: [
        { content: "first message", updated: updated1 },
        { content: "second message", updated: updated1 }
      ],
      pageToken: "newToken",
      messagesLoaded: true
    });
    //second load & token
    newState = moduleReducer(newState, action2);
    expect(newState).toEqual({
      messages: [
        { content: "first message", updated: updated1 },
        { content: "second message", updated: updated1 },
        { content: "third message", updated: updated2 },
        { content: "fourth message", updated: updated2 }
      ],
      pageToken: "secondToken",
      messagesLoaded: true
    });
    //third load & token fails
    newState = moduleReducer(newState, action3);
    //bad date
    expect(newState).not.toEqual({
      messages: [
        { content: "first message", updated: updated2 },
        { content: "second message", updated: updated1 },
        { content: "third message", updated: updated2 },
        { content: "fourth message", updated: updated2 },
        { content: "fifth message", updated: updated2 }
      ],
      pageToken: "thirdToken",
      messagesLoaded: true
    });
    //bad token
    expect(newState).not.toEqual({
      messages: [
        { content: "first message", updated: updated1 },
        { content: "second message", updated: updated1 },
        { content: "third message", updated: updated2 },
        { content: "fourth message", updated: updated2 },
        { content: "fifth message", updated: updated2 }
      ],
      pageToken: "secondToken",
      messagesLoaded: true
    });
    //bad status
    expect(newState).not.toEqual({
      messages: [
        { content: "first message", updated: updated1 },
        { content: "second message", updated: updated1 },
        { content: "third message", updated: updated2 },
        { content: "fourth message", updated: updated2 },
        { content: "fifth message", updated: updated2 }
      ],
      pageToken: "thirdToken",
      messagesLoaded: false
    });
    //content out of order
    expect(newState).not.toEqual({
      messages: [
        { content: "second message", updated: updated1 },
        { content: "first message", updated: updated1 },
        { content: "third message", updated: updated2 },
        { content: "fourth message", updated: updated2 },
        { content: "fifth message", updated: updated2 }
      ],
      pageToken: "thirdToken",
      messagesLoaded: true
    });
    //content altered
    expect(newState).not.toEqual({
      messages: [
        { content: "zeroth message", updated: updated1 },
        { content: "second message", updated: updated1 },
        { content: "third message", updated: updated2 },
        { content: "fourth message", updated: updated2 },
        { content: "fifth message", updated: updated2 }
      ],
      pageToken: "thirdToken",
      messagesLoaded: true
    });
  });
});
