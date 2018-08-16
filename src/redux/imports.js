/* The grand import of all reducers and sagas.
	For every module (aka "Smart Container" in redux-speak) there should be a constants
	file with a NAME_SPACE variable. The pattern here is all reducers should be labeled
	NAME_SPACEReducer and all sagas should likewise be named NAME_SPACESaga

	Name spaces are case sensitive

*/

import { all, fork } from "redux-saga/effects";

//for now this will be a crap ton of imports and a long ass array of Reducers
import initialReducer from "./initialReducer";
// import { default as RootContainerReducer } from "../modules/RootContainer/reducers";
import { default as HomeReducer } from "../modules/Home/reducers";

//import allSagas
//for now this will be a crap ton of imports and a long ass array of sagas...
// import { default as RootContainerSaga } from "../modules/RootContainer/sagas";
import { default as HomeSaga } from "../modules/Home/sagas";

const allReducers = {
	initialReducer: initialReducer,
	// nav: NavigationReducer,
	// RootContainer: RootContainerReducer,
	Home: HomeReducer
};

const sagaFunctions = [HomeSaga()];
// const sagaFunctions = [HomeSaga(), UserSaga(), EditorSaga()];
function* rootSaga() {
	yield all([...sagaFunctions]);
}
export { allReducers, rootSaga };
