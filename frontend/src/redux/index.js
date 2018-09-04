import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { allReducers, rootSaga } from "./imports";

//function that is called by other components to grab
const makeStore = () => {
  const middleware = [];
  const enhancers = [];

  //TODO: Figure out how to add reducers dynamically
  const reducers = combineReducers(allReducers);

  //Add middleware(s)
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);
  enhancers.push(applyMiddleware(...middleware));

  //create and persist the data store
  const store = createStore(reducers, compose(...enhancers));
  sagaMiddleware.run(rootSaga);

  //attach navigation to state
  return { store };
};

const getReduxModule = makeStore();

export default getReduxModule;
