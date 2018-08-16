import React, { PureComponent } from "react";
import styled from "styled-components";

const Carrier = props => {
	return <Container />;
};

export default Carrier;

const Container = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	height: 20px;
	width: 100%;
	background-color: rgba(76, 51, 141, 0.99);
`;
