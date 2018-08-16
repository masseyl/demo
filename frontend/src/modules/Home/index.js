import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";
import Background from "../../components/background";
import ScrollView from "../../components/scrollView";
import Header from "./components/header";
import Carrier from "./components/carrier";
import Card from "../../components/card";
import { getMessages } from "./actions";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { loadMessages: true };
	}

	componentDidMount() {
		this.props.getMessages(100, this.props.pageToken);
	}

	getMessages = debounce(() => {
		this.props.getMessages(50, this.props.pageToken);
	}, 50);
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
		return (
			<Background>
				<Carrier />
				<Header />
				<ScrollView onScroll={this.onScroll}>
					{content.map((card, index) => {
						return <Card key={index} card={card} />;
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
		getMessages: (limit, pageToken) => dispatch(getMessages(limit, pageToken))
	};
}
export default connect(
	mapStateToProps,
	mapPropsToDispatch
)(Home);
