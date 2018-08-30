import React, { Component } from "react";

import { ActionCreators } from "redux-undo";
import { connect } from "react-redux";
import { throttle } from "lodash";
import shortid from "shortid";

import Background from "../../components/background";
import ScrollView from "../../components/scrollView";

import Card from "./components/card";
import Header from "./components/header";
import Undo from "./components/undo";
import Loading from "./components/loading";

import { getMessages, removeMessage } from "./actions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.lastTop = 0;
    this.isScrolling = true;
    this.state = {
      deleteMessageIndex: -1,
      confirmed: true,
      messages: []
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.messages.length !== state.messages.length) {
      return { messages: props.messages };
    }
    return null;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.props.getMessages(60, this.props.pageToken);
    if (!this.state.confirmed) {
      const confirmationPrompt = prompt("Please enter THE CODE");
      this.setState({ confirmed: confirmationPrompt === "fluffy" });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    clearInterval(this.deletingTimer);
    clearInterval(this.undoTimer);
  }

  onScroll = evt => {
    clearInterval(this.scrollTimer);
    const scrollHeight = evt.nativeEvent.target.scrollHeight;
    const scrollTop = evt.nativeEvent.target.scrollTop;
    const deltaScroll = scrollTop - this.lastTop;
    this.lastTop = scrollTop;
    if (Math.abs(deltaScroll) > 3 && !this.isScrolling) {
      this.setState({ isScrolling: true });
      this.isScrolling = true;
    } else {
      this.setState({ isScrolling: false });
      this.isScrolling = false;
    }
    if (Math.floor((scrollTop / scrollHeight) * 100) > 20) {
      if (this.props.messagesLoaded) {
        this.throttleGetMessages();
      }
    }
  };

  throttleGetMessages = throttle(() => {
    this.props.getMessages(50, this.props.pageToken);
  }, 750);

  throttleRemoveMessage = throttle(index => {
    this.setState({
      deleteMessageIndex: index
    });
    this.props.removeMessage(index);
  }, 2000);

  removeMessage = index => {
    this.throttleRemoveMessage(index);
    this.deletingTimer = setTimeout(() => {
      this.setState({
        deleteMessageIndex: -1
      });
    }, 1000);
  };

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight, width: window.innerWidth });
  };

  undoDelete = () => {
    this.props.undo();
    this.setState({
      deleteMessageIndex: -1
    });
  };
  startSwiping = index => {
    console.log("start", index);
    this.setState({ swiping: true, swipingIndex: index });
  };
  endSwiping = () => {
    this.endSwipeTimer = setTimeout(() => {
      this.setState({ swiping: false });
      clearInterval(this.endSwipeTimer);
    }, 1000);
  };
  render() {
    const content = this.props.messages;
    if (!this.state.confirmed) return null;

    return (
      <Background>
        <Header zIndex={2} chaos={this.chaos} />
        <ScrollView zIndex={1} onScroll={this.onScroll}>
          {content.map((card, index) => {
            return (
              <div key={index}>
                <Card
                  isScrolling={this.state.isScrolling}
                  isSwiping={this.state.swiping}
                  swipingIndex={this.state.swipingIndex}
                  width={this.state.width}
                  startSwiping={this.startSwiping}
                  endSwiping={this.endSwiping}
                  card={card}
                  deletedMessageIndex={this.state.deleteMessageIndex}
                  index={index}
                  key={index}
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
