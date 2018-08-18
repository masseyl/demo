import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";
import shortid from "shortid";
import Background from "../../components/background";
import ScrollView from "../../components/scrollView";
import Header from "./components/header";
import Carrier from "./components/carrier";
import Card from "../../components/card";
import { getMessages, removeMessage } from "./actions";
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { loadMessages: true };
		this.audioRef1 = React.createRef();
		this.audioRef2 = React.createRef();
		this.audioRef3 = React.createRef();
	}

	componentDidMount() {
		this.props.getMessages(25, this.props.pageToken);
	}

	getMessages = debounce(() => {
		this.props.getMessages(50, this.props.pageToken);
	}, 500);

	endSounds = () => {
		this.audioRef2.current.currentTime = 0;
		this.audioRef2.current.pause();
		this.audioRef1.current.pause();
	};

	removeMessage = index => {
		this.endSounds();
		this.audioRef3.current.play();

		this.setState({
			deleteMessageIndex: index
		});
		this.props.removeMessage(index || 1);
		setTimeout(() => {
			this.setState({
				deleteMessageIndex: -1
			});
		}, 1000);
	};

	playSqueak = state => {
		if (state) {
			this.audioRef1.current.play();
		} else {
			this.audioRef1.current.pause();
		}
	};

	playNo = state => {
		this.audioRef2.current.currentTime = 0;
		this.audioRef2.current.play();
	};

	onScroll = evt => {
		const scrollHeight = evt.nativeEvent.target.scrollHeight;
		const scrollTop = evt.nativeEvent.target.scrollTop;
		if (scrollTop > scrollHeight * 0.4) {
			if (this.props.messagesLoaded) {
				this.getMessages();
			}
		}
	};

	render() {
		const content = this.props.messages;
		console.log(content.length);
		return (
			<Background>
				<audio ref={this.audioRef1} src={"./assets/long squeak.mp3"} loop />
				<audio ref={this.audioRef2} src={"./assets/NOooooo.mp3"} />
				<audio ref={this.audioRef3} src={"./assets/pop.mp3"} />
				<Carrier zIndex={3} />
				<Header zIndex={2} />
				<ScrollView zIndex={1} onScroll={this.onScroll}>
					{content.map((card, index) => {
						let placeHolder = false;
						if (index === this.state.deleteMessageIndex) {
							placeHolder = true;
						}
						return (
							<div key={shortid.generate()}>
								{placeHolder && <Card placeHolder />}
								<Card
									card={card}
									key={shortid.generate()}
									index={index}
									playNo={this.playNo}
									playSqueak={this.playSqueak}
									removeMessage={this.removeMessage}
									endSounds={this.endSounds}
								/>
							</div>
						);
					})}
				</ScrollView>
			</Background>
		);
	}
}

function mapStateToProps(state) {
	return {
		messagesLoaded: state.Home.messagesLoaded,
		messages: state.Home.messages,
		pageToken: state.Home.pageToken
	};
}

function mapPropsToDispatch(dispatch) {
	return {
		getMessages: (limit, pageToken) => dispatch(getMessages(limit, pageToken)),
		removeMessage: index => dispatch(removeMessage(index))
	};
}

export default connect(
	mapStateToProps,
	mapPropsToDispatch
)(Home);
