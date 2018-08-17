import React, { PureComponent } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import { API_URL } from "../config";

class Card extends PureComponent {
	constructor(props) {
		super(props);

		this.lastX = 0;
		this.state = {
			scaleX: 1,
			scaleY: 1,
			x: 0,
			textHeight: "45px",
			clamp: 3,
			returnToZero: false
		};
	}
	componentDidMount() {
		if (this.props.placeHolder) {
			console.log("PLACEHOLDER!!!!!", this.props.index);
			setTimeout(
				() =>
					this.setState({
						scaleX: 0,
						scaleY: 0,
						returnToZero: true
					}),
				100
			);
		}
	}

	onSwipeState = () => {
		this.setState({ returnToZero: false });
	};

	onSwipeMove = (position, event) => {
		if (position.x > 250) {
			this.props.removeMessage(this.props.index);
		} else {
			this.setState({
				x: position.x
			});
		}
	};

	onSwipeEnd = event => {
		this.setState({
			x: 0,
			returnToZero: true
		});
		setTimeout(() => this.setState({ returnToZero: false }), 250);
	};

	toggleHeight = () => {
		console.log(this.state);
		const expand = this.state.textHeight !== "120px";
		this.setState({
			textHeight: expand ? "120px" : "45px",
			clamp: expand ? 3 : -1,
			scroll: expand ? "scroll" : "hidden"
		});
	};

	render() {
		const isPlaceHolder = this.props.placeHolder;
		const photo = isPlaceHolder ? "" : this.props.card.author.photoUrl;
		const author = isPlaceHolder ? "" : this.props.card.author.name;
		const content = isPlaceHolder ? "" : this.props.card.content;
		return (
			<Swipe
				onSwipeMove={isPlaceHolder ? null : this.onSwipeMove}
				onSwipeEnd={isPlaceHolder ? null : this.onSwipeEnd}
			>
				<Container
					amPlaceholder={this.props.placeHolder}
					x={this.state.x}
					returnToZero={this.state.returnToZero}
					scaleX={this.state.scaleX}
					scaleY={this.state.scaleY}
				>
					<TopRow>
						<Image src={"http://message-list.appspot.com" + photo} />
						<NameBox>
							<Author>{author}</Author>
							<Duration>duration</Duration>
						</NameBox>
					</TopRow>
					<Text
						onClick={this.toggleHeight}
						clamp={this.state.clamp}
						height={this.state.textHeight}
						scroll={this.state.scroll}
					>
						{content}
					</Text>
				</Container>
			</Swipe>
		);
	}
}

export default Card;

const Container = styled.div`
	margin: auto;
	width: 92%;
	margin-bottom: 14px;
	padding: 7px;
	background-color: white;
	transform: scale3d(
			${props => {
				console.log("Sacle: ", props.scaleX);
				return props.scaleX;
			}},
			${props => props.scaleY},
			1
		)
		translate3d(${props => props.x}px, 0, 0);
	transition: transform ${props => (props.returnToZero ? 0.4 : 0.05)}s;
`;

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
	height: ${props => props.height};
	overflow-x: ${props => props.scroll};
	font-size: 14px;
	color: rgba(11, 11, 11, 0.8);
	overflow-x: ${props => (props.clamp === 3 ? "hidden" : "scroll")};
	display: -webkit-box;
	-webkit-line-clamp: ${props => props.clamp};
	-webkit-box-orient: vertical;
	transition: height 0.5s ease-out;
`;
