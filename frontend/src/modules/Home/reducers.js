import moment from "moment";
import {
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAIL,
  HIDE_UNDO,
  REMOVE_MESSAGE
} from "./constants";

let INITIAL_STATE = {
  messages: []
};

let newState; //out of habit I only copy state when I need to
let messages;
const moduleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      newState = { ...state };
      newState.messagesLoaded = false;

      return newState;

    case GET_MESSAGES_SUCCESS:
      newState = { ...state };
      messages = [...newState.messages];

      newState = { ...state };
      newState.pageToken = action.response.pageToken;
      messages = messages.concat(action.response.messages);
      // //not sure this is needed since messages seem to all be timestamped 4 years ago...
      messages.sort((a, b) => {
        if (moment(a.updated).isSame(b.updated)) return 0;
        if (moment(a.updated).isBefore(b.updated)) return -1;
        return 1;
      });
      newState.messages = messages;
      newState.messagesLoaded = true;

      return newState;

    case GET_MESSAGES_FAIL:
      newState = { ...state };
      newState.messagesLoaded = true;
      return newState;

    case HIDE_UNDO:
      newState = { ...state };
      newState.undoable = false;

      return newState;

    case REMOVE_MESSAGE:
      newState = { ...state };
      messages = [...newState.messages];
      messages = [
        ...messages.slice(0, action.index),
        ...messages.slice(action.index + 1)
      ];
      newState.messages = messages;
      newState.undoable = true;

      return newState;

    default:
      return state;
  }
};

export default moduleReducer;
