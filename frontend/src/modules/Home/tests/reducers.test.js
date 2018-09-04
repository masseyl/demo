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
        pageToken: "fluffy",
        messages: [
          { content: "hey!", updated: updated1 },
          { content: "there", updated: updated1 },
          { content: "man!", updated: updated1 }
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
        { content: "hey!", updated: updated1 },
        { content: "man!", updated: updated1 }
      ],
      pageToken: "fluffy",
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
        pageToken: "fluffy",
        messages: [
          { content: "hi!", updated: updated1 },
          { content: "there!", updated: updated1 }
        ]
      }
    };
    let action2 = {
      type: GET_MESSAGES_SUCCESS,
      response: {
        pageToken: "fluffy2",
        messages: [
          { content: "good!", updated: updated2 },
          { content: "to meet you!", updated: updated2 }
        ]
      }
    };
    let action3 = {
      type: GET_MESSAGES_SUCCESS,
      response: {
        pageToken: "fluffy3",
        messages: [{ content: "enough!", updated: updated2 }]
      }
    };
    //initial load & token
    newState = moduleReducer(INITIAL_STATE, action1);
    expect(newState).toEqual({
      messages: [
        { content: "hi!", updated: updated1 },
        { content: "there!", updated: updated1 }
      ],
      pageToken: "fluffy",
      messagesLoaded: true
    });
    //second load & token
    newState = moduleReducer(newState, action2);
    expect(newState).toEqual({
      messages: [
        { content: "hi!", updated: updated1 },
        { content: "there!", updated: updated1 },
        { content: "good!", updated: updated2 },
        { content: "to meet you!", updated: updated2 }
      ],
      pageToken: "fluffy2",
      messagesLoaded: true
    });
    //third load & token fails
    newState = moduleReducer(newState, action3);
    //bad date
    expect(newState).not.toEqual({
      messages: [
        { content: "hi!", updated: updated2 },
        { content: "there!", updated: updated1 },
        { content: "good!", updated: updated2 },
        { content: "to meet you!", updated: updated2 },
        { content: "enough!", updated: updated2 }
      ],
      pageToken: "fluffy3",
      messagesLoaded: true
    });
    //bad token
    expect(newState).not.toEqual({
      messages: [
        { content: "hi!", updated: updated1 },
        { content: "there!", updated: updated1 },
        { content: "good!", updated: updated2 },
        { content: "to meet you!", updated: updated2 },
        { content: "enough!", updated: updated2 }
      ],
      pageToken: "fluffy2",
      messagesLoaded: true
    });
    //bad status
    expect(newState).not.toEqual({
      messages: [
        { content: "hi!", updated: updated1 },
        { content: "there!", updated: updated1 },
        { content: "good!", updated: updated2 },
        { content: "to meet you!", updated: updated2 },
        { content: "enough!", updated: updated2 }
      ],
      pageToken: "fluffy3",
      messagesLoaded: false
    });
    //content out of order
    expect(newState).not.toEqual({
      messages: [
        { content: "there!", updated: updated1 },
        { content: "hi!", updated: updated1 },
        { content: "good!", updated: updated2 },
        { content: "to meet you!", updated: updated2 },
        { content: "enough!", updated: updated2 }
      ],
      pageToken: "fluffy3",
      messagesLoaded: true
    });
    //content altered
    expect(newState).not.toEqual({
      messages: [
        { content: "HOWDY!", updated: updated1 },
        { content: "there!", updated: updated1 },
        { content: "good!", updated: updated2 },
        { content: "to meet you!", updated: updated2 },
        { content: "enough!", updated: updated2 }
      ],
      pageToken: "fluffy3",
      messagesLoaded: true
    });
  });
});
