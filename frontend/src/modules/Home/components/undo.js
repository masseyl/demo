import React, { PureComponent } from "react";
import styled from "styled-components";

const Undo = props => {
	return (
		<Container onClick={props.onClick}>
			<Message>Undo</Message>
		</Container>
	);
};

export default Undo;
const Container = styled.div`
	position: absolute;
	z-index: 9999;
	height: 40px;
	width: 92%;
	top: 7px;
	box-shadow: 2px 5px 40px 0;
	background-color: black;
	border-radius: 2px;
	margin-left: 4%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const Message = styled.p`
	color: red;
	margin-left: 4%;
`;
