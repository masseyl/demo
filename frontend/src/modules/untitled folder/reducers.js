import { SAVE, UPLOAD, ON_PROGRESS } from "./constants";
import Immutable from "seamless-immutable";

let INITIAL_STATE = {};

const moduleReducer = (state = INITIAL_STATE, action) => {
	let newState = Immutable.asMutable(state, { deep: true });
	switch (action.type) {
		case SAVE:
			newState.data = action.payload;

			return newState;

		default:
			return state;
	}
};

export default moduleReducer;
