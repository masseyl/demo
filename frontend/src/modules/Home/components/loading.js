import React, { PureComponent } from "react";
import styled from "styled-components";

const Loading = props => {
	return (
		<Container showHide={props.showHide}>
			<Spinner src="./assets/spinner.gif" />
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: row;
	visibility: ${props => (props.showHide ? "visible" : "hidden")};
	z-index: 9999;
	height: 48px;
	width: 96%;
	box-shadow: 2px 5px 40px 0;
	background-color: black;
	border-radius: 2px;
	margin-left: 2%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: 10px;
	background-color: rgba(255, 255, 255, 0.8);
`;

const Spinner = styled.img`
	width: 40px;
	height: 40px;
	align-self: center;
`;
export default Loading;
