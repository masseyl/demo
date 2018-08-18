import React, { PureComponent } from "react";
import styled from "styled-components";

const hi = () => {
	const hamburger = prompt("Hi! I'm a HAMBURGER! What are you?! \n\n:)");

	window.alert(
		"Ohhhhh..... I LOVE " +
			hamburger +
			"\n\nBTW: You should hire Lance. He's a happy guy. \n\n :)"
	);
};
const Header = props => {
	return (
		<Container zIndex={props.zIndex} onClick={props.onClick}>
			<Menu onClick={hi}>
				<Span>menu</Span>
			</Menu>
			<Title>
				<Span>Title</Span>
			</Title>
		</Container>
	);
};

export default Header;

const Container = styled.div`
	z-index: ${props => props.zIndex};
	position: fixed;
	top: 20px;
	right: 0;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	height: 52px;
	width: 100%;
	background-color: rgba(96, 64, 176, 0.99);
`;

const Menu = styled.div`
	flex: 1;
	margin-left: 14px;
`;
const Title = styled.div`
	flex: 4;
`;
const Span = styled.span`
	color: white;
`;
