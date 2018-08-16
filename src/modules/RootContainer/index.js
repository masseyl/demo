import React from "react";
import styled from "styled-components";
import { Router, Switch, Route } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import Transitions from "../../transitions";

import Home from "../Home";
import FourOhFour from "./FourOhFour";

const history = createHistory();

const RootContainer = props => {
	return (
		<Router history={history}>
			<Route
				render={({ location }) => {
					return (
						<Perspective>
							<Transitions pageKey={location.key} {...location.state}>
								<Switch location={location}>
									<Route exact path="/" component={Home} />
									<Route path="*" component={FourOhFour} />
								</Switch>
							</Transitions>
						</Perspective>
					);
				}}
			/>
		</Router>
	);
};

export default RootContainer;
const Perspective = styled.div`
	width: 100vw;
	height: 100vh;
	perspective: 1200px;
`;
