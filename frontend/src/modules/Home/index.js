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
	}

	componentDidCatch(error, info) {
		// Display fallback UI
		this.setState({ hasError: true });
		// You can also log the error to an error reporting service
		console.log(error, info);
	}

	componentDidMount() {
		this.props.getMessages(25, this.props.pageToken);
	}

	removeMessage = index => {
		this.setState({
			deleteMessageIndex: index
		});
		console.log(index);
		this.props.removeMessage(index || 1);
		setTimeout(
			() =>
				this.setState({
					deleteMessageIndex: -1
				}),
			500
		);
	};

	getMessages = debounce(() => {
		this.props.getMessages(50, this.props.pageToken);
	}, 100);

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
									key={shortid.generate()}
									index={index}
									card={card}
									removeMessage={this.removeMessage}
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
