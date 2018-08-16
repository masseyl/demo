import React, { PureComponent } from "react";
import styled from "styled-components";

const Text = props => {
	return (
		<Container width={props.width} bold={props.bold} onClick={props.onClick}>
			{props.words}
		</Container>
	);
};

const Container = styled.div`
	margin: 0 auto 3.5vh;
	width: 75vw;
	width: ${props => props.width}vw;
	font-size: 2rem; //3.2 looked good on inspector but not tablet
	text-align: center;
	font-family: "Lato", sans-serif;
	font-weight: ${props => (props.bold ? "900;" : "500;")};
	${props => (props.onClick ? "color:#FFF;" : "")};
`;

export default Text;
