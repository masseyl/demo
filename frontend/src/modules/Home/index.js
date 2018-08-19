import React, { Component } from "react";

import { ActionCreators } from "redux-undo";
import { connect } from "react-redux";
import { debounce } from "lodash";
import shortid from "shortid";
import { Helmet } from "react-helmet";

import Background from "../../components/background";
import Carrier from "../../components/carrier";
import ScrollView from "../../components/scrollView";

import Card from "./components/card";
import Header from "./components/header";
import Undo from "./components/undo";
import Loading from "./components/loading";

import { getMessages, removeMessage } from "./actions";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deleteMessageIndex: -1,
			confirmed: false
		};
		this.audioRef1 = React.createRef();
		this.audioRef2 = React.createRef();
		this.audioRef3 = React.createRef();
	}

	componentDidMount() {
		this.props.getMessages(10, this.props.pageToken);
		if (!this.state.confirmed) {
			const confirmationPrompt = prompt("Please enter THE CODE");
			this.setState({ confirmed: confirmationPrompt === "fluffy" });
		}
	}

	componentWillUnmount() {
		clearInterval(this.deletingTimer);
		clearInterval(this.undoTimer);
	}

	onScroll = evt => {
		const scrollHeight = evt.nativeEvent.target.scrollHeight;
		const scrollTop = evt.nativeEvent.target.scrollTop;
		if (scrollTop > scrollHeight * 0.4) {
			if (this.props.messagesLoaded) {
				this.debounceGetMessages();
			}
		}
	};

	chaos = chaos => {
		this.setState({ chaos });
	};
	debounceGetMessages = debounce(() => {
		this.props.getMessages(50, this.props.pageToken);
	}, 500);

	debounceRemoveMessage = debounce(index => {
		this.props.removeMessage(index);
	}, 1000);

	endSounds = () => {
		this.audioRef2.current.pause();
		this.audioRef1.current.pause();
	};

	playSqueak = state => {
		if (state) {
			this.audioRef1.current.play();
		} else {
			this.audioRef1.current.pause();
		}
	};

	removeMessage = index => {
		this.endSounds();
		if (this.state.chaos) {
			this.audioRef2.current.volume = 0.1;
			this.audioRef1.current.volume = 0.5;
		}
		this.audioRef2.current.play();

		this.setState({
			deleteMessageIndex: index
		});
		this.debounceRemoveMessage(index);
		this.deletingTimer = setTimeout(() => {
			this.setState({
				deleteMessageIndex: -1
			});
		}, 1000);
		if (this.props.messages.length < 3) {
			this.props.getMessages(50, this.props.pageToken);
		}
	};

	undoDelete = () => {
		this.audioRef3.current.play();
		this.props.undo();
		this.setState({
			deleteMessageIndex: -1
		});
	};

	render() {
		const content = this.props.messages;
		if (!this.state.confirmed) return null;
		return (
			<Background>
				<Carrier />
				<Helmet>
					<meta name="theme-color" content="rgba(76, 51, 141, 0.99)" />
				</Helmet>
				<Undo onClick={this.undoDelete} showHide={this.props.removingMessage} />
				<Header zIndex={2} chaos={this.chaos} />
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
									onSwipeEnd={this.endSounds}
									card={card}
									chaos={this.state.chaos}
									index={index}
									key={shortid.generate()}
									playSqueak={this.playSqueak}
									removingMessage={this.props.removingMessage}
									removeMessage={this.removeMessage}
								/>
							</div>
						);
					})}
				</ScrollView>
				<Loading showHide={!this.props.messagesLoaded} />
				<audio ref={this.audioRef1} src={"./assets/long squeak.mp3"} loop />
				<audio ref={this.audioRef2} src={"./assets/pop.mp3"} />
				<audio ref={this.audioRef3} src={"./assets/revpop.mp3"} />
			</Background>
		);
	}
}

function mapStateToProps(state) {
	return {
		removingMessage: state.Home.present.removingMessage,
		messagesLoaded: state.Home.present.messagesLoaded,
		messages: state.Home.present.messages,
		pageToken: state.Home.present.pageToken
	};
}

function mapPropsToDispatch(dispatch) {
	return {
		getMessages: (limit, pageToken) => dispatch(getMessages(limit, pageToken)),
		removeMessage: index => dispatch(removeMessage(index)),
		undo: () => dispatch(ActionCreators.undo())
	};
}

export default connect(
	mapStateToProps,
	mapPropsToDispatch
)(Home);
