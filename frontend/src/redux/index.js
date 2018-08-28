import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { allReducers, rootSaga } from "./imports";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["navigation"]
};

//function that is called by other components to grab
const makeStore = () => {
  const middleware = [];
  const enhancers = [];

  //TODO: Figure out how to add reducers dynamically
  const reducers = combineReducers(allReducers);
  // const persistedReducer = persistReducer(persistConfig, reducers);

  //Add middleware(s)
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);
  enhancers.push(applyMiddleware(...middleware));

  //create and persist the data store
  const store = createStore(reducers, compose(...enhancers));
  // const store = createStore(persistedReducer, compose(...enhancers));
  // let persistor = persistStore(store);
  // persistor.purge();
  sagaMiddleware.run(rootSaga);

  //attach navigation to state
  return { store };
  // return { store, persistor };
};

const getReduxModule = makeStore();

export default getReduxModule;
