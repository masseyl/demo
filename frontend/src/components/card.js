import React, { PureComponent } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import moment from "moment";

class Card extends PureComponent {
	constructor(props) {
		super(props);
		const backgroundImage = Math.floor(Math.random() * backgrounds.length);

		this.state = {
			scaleX: 1,
			scaleY: 1,
			x: 0,
			textHeight: "45px",
			clamp: 3,
			returnToZero: false,
			background: backgrounds[backgroundImage]
		};
	}

	componentDidMount() {
		this.velocityArray = [0];
		this.lastX = 0;
		this.updateWindowDimensions();
		window.addEventListener("resize", this.updateWindowDimensions);
		if (this.props.placeHolder) {
			this.placeholderTimer = setTimeout(
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

	componentWillUnmount = () => {
		clearInterval(this.timeout);
		clearInterval(this.placeholderTimer);
		window.removeEventListener("resize", this.updateWindowDimensions);
	};

	onScroll = evt => {
		evt.stopPropagation();
	};

	onSwipeMove = (position, event) => {
		this.whatToDo(position);
	};

	onSwipeEnd = event => {
		this.props.onSwipeEnd();
		this.setState({
			x: 0,
			returnToZero: true
		});
		this.timeout = setTimeout(() => {
			this.setState({ returnToZero: false });
		}, 400);
	};

	calculateVelocity = deltaX => {
		let velocity = 0;
		let velocityArray = [...this.velocityArray];
		velocityArray.push(deltaX);

		if (velocityArray.length > 10) {
			if (velocityArray.length >= 11) {
				velocityArray.unshift();
			}

			velocity = velocityArray.reduce(
				(average, nextValue) => (average + nextValue) / velocityArray.length,
				velocityArray[0]
			);
		}
		this.velocityArray = velocityArray;
		return velocity;
	};

	toggleHeight = () => {
		const expand = this.state.textHeight !== "120px";
		this.setState({
			textHeight: expand ? "120px" : "45px",
			clamp: expand ? 3 : -1,
			scroll: expand ? "scroll" : "hidden"
		});
	};
	updateWindowDimensions = () => {
		this.setState({ width: window.innerWidth });
	};
	whatToDo = position => {
		const deltaX = position.x - this.lastX;
		const velocity = this.calculateVelocity(deltaX);
		this.lastX = position.x;
		if (position.x > 1) {
			this.props.playSqueak(true);
		} else {
			this.props.playSqueak(false);
		}

		if (
			(position.x > this.state.width * 0.5 || velocity > 1.6) &
			!this.state.removingMessage
		) {
			this.props.removeMessage(this.props.index);
			this.velocityArray = [0];
			this.lastX = 0;
		} else {
			this.setState({
				x: position.x
			});
		}
	};

	render() {
		const isPlaceHolder = this.props.placeHolder;
		const photo = isPlaceHolder ? "" : this.props.card.author.photoUrl;
		const author = isPlaceHolder ? "" : this.props.card.author.name;
		const content = isPlaceHolder ? "" : this.props.card.content;
		const updated = isPlaceHolder
			? ""
			: moment(this.props.card.updated).fromNow();
		return (
			<Swipe
				allowMouseEvents
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
							<Duration>{updated}</Duration>
						</NameBox>
					</TopRow>
					<Text
						onClick={this.toggleHeight}
						clamp={this.state.clamp}
						height={this.state.textHeight}
						scroll={this.state.scroll}
						onScroll={this.onScroll}
					>
						{content}
					</Text>
				</Container>
				<Background>
					<BackgroundImage src={this.state.background} />
				</Background>
			</Swipe>
		);
	}
}

export default Card;

const Author = styled.div`
	padding-top: 7px;
	font-weight: bold;
	font-size: 14px;
	color: rgba(22, 22, 22, 0.7);
`;

const Background = styled.div`
	position: relative;
	width: 92%;
	margin-left: 4%;
`;

const BackgroundImage = styled.img`
	flex: 1;
	position: absolute;
	width: 80px;
	height: 80px;
	margin: 10px;
`;

const Container = styled.div`
	width: 88%;
	margin-left:4%
	margin-bottom: 7px;
	padding: 7px;
	background-color: white;
	transform: scale3d(
			${props => {
				return props.scaleX;
			}},
			${props => props.scaleY},
			1
		)
		translate3d(${props => props.x}px, 0, 0);
	transition: transform ${props => (props.returnToZero ? 0.5 : 0.05)}s ease-out;
`;

const Duration = styled.p`
	font-size: 12px;
	color: rgba(99, 99, 99, 0.6);
	border-width: 1px;
	margin-top: 1px;
`;

const Image = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 30px;
	border-width: 1px;
	margin-right: 10px;
`;

const NameBox = styled.div`
	padding-top: 4px;
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

const TopRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-left: 10px;
	height: 48px;
`;
const backgrounds = [
	"./assets/surprised-face.jpg",
	"./assets/scary apk.jpg",
	"./assets/cat-humor-surprise-did-i-scare-you.jpg",
	"./assets/30992649-zombie-pumpkin-halloween-greeting-card-with-copyspace-as-a-scary-surprise-creepy-jack-o-lantern-with.jpg"
];
