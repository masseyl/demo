import React, { PureComponent } from "react";
import styled from "styled-components";

class Header extends PureComponent {
	hi = () => {
		const hamburger = prompt("Hi! I'm a HAMBURGER! What are you?! \n\n:)");

		const message = hamburger
			? "Ohhhhh..... I LOVE " + hamburger + " \n\nBTW:"
			: "";
		window.alert(message + "You should hire Lance. He's a good guy. \n\n:)");
	};
	render() {
		return (
			<Container zIndex={this.props.zIndex} onClick={this.props.onClick}>
				<Menu onClick={this.hi}>
					<Hamburger src="./assets/hamburger.png" />
				</Menu>
				<Title>
					<Span>&lt;==&nbsp;&nbsp;Secret Messages!</Span>
				</Title>
			</Container>
		);
	}
}

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

const Hamburger = styled.img`
	width: 20px;
	height: 25px;
`;
const LeftArrow = styled.img`
	width: 30px;
	height: 30px;
	opacity: ${props => props.opacity};
`;
const Menu = styled.div`
	flex: 1;
	margin-right: 14px;
	margin-left: 14px;
`;
const Title = styled.div`
	flex: 4;
`;
const Span = styled.span`
	color: white;
`;
