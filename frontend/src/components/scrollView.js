import React, { PureComponent } from "react";
import styled from "styled-components";

const ScrollView = props => {
	return <Container onScroll={props.onScroll}>{props.children}</Container>;
};

const Container = styled.div`
	justify-content: center;
	width: 100vw;
	height: 100vh;
	background-color: transparent;
	padding-top: 86px;
	padding-bottom: 86px;
	overflow-y: scroll;
`;

export default ScrollView;
