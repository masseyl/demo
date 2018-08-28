import React, { Component } from "react";

import { ActionCreators } from "redux-undo";
import { connect } from "react-redux";
import { debounce } from "lodash";
import shortid from "shortid";

import Background from "../../components/background";
import ScrollView from "../../components/scrollView";

import Card from "./components/card";
import Header from "./components/header";
// import Undo from "./components/undo";
import Loading from "./components/loading";

import { getMessages, removeMessage } from "./actions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteMessageIndex: -1,
      confirmed: false,
      messages: []
    };
  }

  componentDidMount() {
    this.props.getMessages(200, this.props.pageToken);
    if (!this.state.confirmed) {
      const confirmationPrompt = prompt("Please enter THE CODE");
      this.setState({ confirmed: confirmationPrompt === "fluffy" });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.messages.length !== state.messages.length) {
      return { messages: props.messages };
    }
    return null;
  }
  componentWillUnmount() {
    clearInterval(this.deletingTimer);
    clearInterval(this.undoTimer);
  }

  onScroll = evt => {
    const scrollHeight = evt.nativeEvent.target.scrollHeight;
    const scrollTop = evt.nativeEvent.target.scrollTop;
    if (scrollTop > scrollHeight * 0.2) {
      if (this.props.messagesLoaded) {
        this.debounceGetMessages();
      }
    }
  };

  debounceGetMessages = debounce(() => {
    this.props.getMessages(20, this.props.pageToken);
  }, 100);

  debounceRemoveMessage = debounce(index => {
    this.props.removeMessage(index);
  }, 1000);

  removeMessage = index => {
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
    this.props.undo();
    this.setState({
      deleteMessageIndex: -1
    });
  };

  render() {
    const content = this.state.messages;
    if (!this.state.confirmed) return null;

    return (
      <Background>
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
                  card={card}
                  chaos={this.state.chaos}
                  index={index}
                  key={shortid.generate()}
                  removingMessage={this.props.removingMessage}
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
    removingMessage: state.Home.removingMessage,
    messagesLoaded: state.Home.messagesLoaded,
    messages: state.Home.messages,
    pageToken: state.Home.pageToken
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
