import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";
import shortid from "shortid";
import { ActionCreators } from "redux-undo";

import Background from "../../components/background";
import Card from "../../components/card";
import ScrollView from "../../components/scrollView";

import Header from "./components/header";
import Carrier from "./components/carrier";
import Undo from "./components/undo";

import { getMessages, removeMessage, undoRemoveMessage } from "./actions";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { loadMessages: true };
		this.audioRef1 = React.createRef();
		this.audioRef2 = React.createRef();
	}

	componentDidMount() {
		this.props.getMessages(25, this.props.pageToken);
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
		this.undoTimer = setTimeout(() => {
			this.props.undoRemoveMessage();
		}, 5000);
	};

	undoDelete = () => {
		this.props.undo();
		this.props.undoRemoveMessage();
		this.setState({
			deleteMessageIndex: -1
		});
	};

	render() {
		const content = this.props.messages;
		return (
			<Background>
				{this.props.removingMessage && <Undo onClick={this.undoDelete} />}
				<audio ref={this.audioRef1} src={"./assets/long squeak.mp3"} loop />
				<audio ref={this.audioRef2} src={"./assets/pop.mp3"} />
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
									playSqueak={this.playSqueak}
									removeMessage={this.removeMessage}
									onSwipeEnd={this.endSounds}
									removingMessage={this.props.removingMessage}
									done={this.messageRemoved}
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
		undoRemoveMessage: () => {
			dispatch(undoRemoveMessage());
		},
		undo: () => dispatch(ActionCreators.undo())
	};
}

export default connect(
	mapStateToProps,
	mapPropsToDispatch
)(Home);
