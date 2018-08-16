import React, { PureComponent } from "react";
import styled from "styled-components";
import { API_URL } from "../config";
const Card = props => {
	let textHeight = 40;
	const label = props.label;
	return (
		<Container>
			<TopRow>
				<Image
					src={"http://message-list.appspot.com" + props.card.author.photoUrl}
				/>
				<NameBox>
					<Author>{props.card.author.name}</Author>
					<Duration>duration</Duration>
				</NameBox>
			</TopRow>
			<Text
				onClick={() => {
					this.textHeight = 80;
				}}
				textHeight={this.textHeight}
			>
				{props.card.content}
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
	width: 40px;
	height: 40px;
	border-radius: 30px;
	border-width: 1px;
	margin-right: 10px;
`;

const TopRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-left: 10px;
	height: 48px;
`;

const Author = styled.div`
	padding-top: 7px;
	font-weight: bold;
	font-size: 14px;
	color: rgba(22, 22, 22, 0.7);
`;

const NameBox = styled.div`
	padding-top: 4px;
`;

const Duration = styled.p`
	font-size: 12px;
	color: rgba(99, 99, 99, 0.6);
	border-width: 1px;
	margin-top: 1px;
`;

const Text = styled.p`
	font-size: 14px;
	color: rgba(11, 11, 11, 0.8);
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	margin-left: 10px;
`;
