import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import getReduxModule from "../../redux";
import RootContainer from "../RootContainer";

const { store, persistor } = getReduxModule;

const App = props => {
  return (
    <Provider store={store}>
      <RootContainer />
    </Provider>
  );
};

export default App;
