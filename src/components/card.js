import React, { PureComponent } from "react";
import styled from "styled-components";

const Card = props => {
	let textHeight = 40;
	const label = props.label;
	return (
		<Container>
			<TopRow>
				<Image />
				<Title>{props.info.title}</Title>
			</TopRow>
			<Text
				onClick={() => {
					this.textHeight = 80;
				}}
				textHeight={this.textHeight}
			>
				{props.info.body}
			</Text>
		</Container>
	);
};

const Container = styled.div`
	max-height: 20vh;
	min-height: 10vh;
	margin: auto;
	width: 92%;
	margin-bottom: 14px;
	padding: 7px;
	background-color: white;
`;

export default Card;

const Image = styled.img`
	width: 30px;
	height: 30px;
	border-radius: 10px;
	border-width: 1px;
	margin-right: 10px;
`;
const TopRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;
const Title = styled.div`
	font-weight: bold;
	font-size: 16;
	color: rgba(22, 22, 22, 0.7);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;
const Text = styled.p`
	font-size: 10;
	color: rgba(99, 99, 99, 0.7);
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
`;
