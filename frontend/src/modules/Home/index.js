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
      messages: [],
      forceUpdate: 0
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
    //
    if (Math.floor((scrollTop / scrollHeight) * 100) > 20) {
      if (this.props.messagesLoaded) {
        this.throttleGetMessages();
      }
    }

    //optimization for list rendering
    if (Math.abs(deltaScroll) > 3 && !this.isScrolling) {
      this.setState({ isScrolling: true });
      this.isScrolling = true;
    } else {
      this.setState({ isScrolling: false });
      this.isScrolling = false;
    }
  };

  endSwiping = () => {
    //give the ending animation time to complete
    this.endSwipeTimer = setTimeout(() => {
      this.setState({ swiping: false });
      clearInterval(this.endSwipeTimer);
    }, 1000);
  };

  removeMessage = index => {
    this.throttleRemoveMessage(index);
  };

  startSwiping = index => {
    //simulate a virtual list by informing cards which one is swiping
    // the one's who aren't in view don't update
    this.setState({ swiping: true, swipingIndex: index });
  };

  throttleGetMessages = throttle(() => {
    this.props.getMessages(50, this.props.pageToken);
  }, 750);

  throttleRemoveMessage = throttle(index => {
    //tell the cards which one of them is being removed
    this.setState({
      deleteMessageIndex: index
    });

    this.removeTimer = setTimeout(() => {
      //after animations have completed update the view data
      this.props.removeMessage(index);
      this.setState({
        deleteMessageIndex: -1
      });
    }, 500);
  }, 2000);

  undoDelete = () => {
    this.props.undo();
  };

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight, width: window.innerWidth });
  };

  render() {
    const content = this.props.messages;
    if (!this.state.confirmed) return null;

    return (
      <Background>
        <Header zIndex={2} chaos={this.chaos} />
        <ScrollView
          onScroll={this.onScroll}
          isScrolling={this.state.isScrolling}
          removingMessage={this.props.removingMessage}
          zIndex={1}
        >
          {content.map((card, index) => {
            return (
              <div key={index}>
                <Card
                  card={card}
                  deletedMessageIndex={this.state.deleteMessageIndex}
                  endSwiping={this.endSwiping}
                  index={index}
                  isScrolling={this.state.isScrolling}
                  isSwiping={this.state.swiping}
                  key={index}
                  removeMessage={this.removeMessage}
                  startSwiping={this.startSwiping}
                  swipingIndex={this.state.swipingIndex}
                  width={this.state.width}
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
    undo: () => dispatch(ActionCreators.undo())
  };
}

export default connect(
  mapStateToProps,
  mapPropsToDispatch
)(Home);
