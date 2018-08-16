let INITIAL_STATE = {
  payload: null
};

const initialReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "unknown":
      return Object.assign({ state, payload: action.payload });
  }
  return state;
};

export default initialReducer;
