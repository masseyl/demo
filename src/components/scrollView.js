import React, { PureComponent } from "react";
import styled from "styled-components";

const ScrollView = props => {
	return <Container>{props.children}</Container>;
};

const Container = styled.div`
	justify-content: center;
	width: 100vw;
	height: 100vh;
	background-color: transparent;
	padding-top: 86px;
	overflow-y: scroll;
`;

export default ScrollView;
