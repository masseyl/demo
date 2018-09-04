import React from "react";
import { Provider } from "react-redux";
import getReduxModule from "../../redux";
import RootContainer from "../RootContainer";

const { store } = getReduxModule;

const App = props => {
  return (
    <Provider store={store}>
      <RootContainer />
    </Provider>
  );
};

export default App;
