import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

// the childFactory allows to change the transition of the leaving component
// https://github.com/reactjs/react-transition-group/issues/182
const childFactoryCreator = props => child => React.cloneElement(child, props);

export default ({
	transition = "scale",
	duration = 500,
	pageKey,
	timeout = 500,
	children
}) => (
	<TransitionGroup
		childFactory={childFactoryCreator({
			classNames: transition,
			timeout: duration || 500
		})}
	>
		<CSSTransition timeout={duration || 500} key={pageKey}>
			{/* you should wrap CSSTransition child in a div in case it could be null
      see https://github.com/reactjs/react-transition-group/issues/208 */}
			<div>{children}</div>
		</CSSTransition>
	</TransitionGroup>
);

export { default as scale } from "./scale";
