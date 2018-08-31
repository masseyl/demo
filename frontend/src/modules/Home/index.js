import React, { Component } from "react";
import styled from "styled-components";

import { ActionCreators } from "redux-undo";
import { connect } from "react-redux";
import { throttle } from "lodash";
import shortid from "shortid";
import VirtualList from "react-tiny-virtual-list";
import Background from "../../components/background";
import ScrollView from "../../components/scrollView";

import SwipeableCard from "./components/swipeableCard";
import DetailCard from "./components/detailCard";
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
      forceUpdate: 0,
      hideDetail: true
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
    this.props.getMessages(100, this.props.pageToken);
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
    const NOW = evt / 50 - Math.floor(evt / 50);
    if (NOW === 0) {
      if (this.props.messagesLoaded) {
        this.throttleGetMessages();
        this.setState({
          forcer: Math.random()
        });
        // this.forceUpdate();
      }
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
  showDetail = showHide => {
    this.setState({
      showDetail: showHide
    });
  };
  startSwiping = index => {
    //simulate a virtual list by informing cards which one is swiping
    // the one's who aren't in view don't update
    this.setState({ swiping: true, swipingIndex: index });
  };

  throttleGetMessages = throttle(() => {
    console.log("debug");
    this.props.getMessages(100, this.props.pageToken);
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
        <Undo onClick={this.undoDelete} showHide={this.props.removingMessage} />
        <Header zIndex={2} chaos={this.chaos} />
        <List>
          <VirtualList
            overscanCount={50}
            onScroll={this.onScroll}
            width="100%"
            height={window.innerHeight - 52}
            itemCount={content.length}
            itemSize={132} // Also supports variable heights (array or function getter)
            renderItem={({ index, style }) => (
              <div key={index} style={style}>
                <SwipeableCard
                  showDetail={() => this.showDetail(true)}
                  card={content[index]}
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
            )}
          />
        </List>
        <Detail show={this.state.showDetail}>
          {content.length > 0 &&
            this.state.swipingIndex &&
            content[this.state.swipingIndex].content && (
              <DetailCard
                card={content[this.state.swipingIndex || 0]}
                toggle={this.showDetail}
              />
            )}
        </Detail>
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

const Detail = styled.div`
  position: absolute;
  display: ${props => (props.show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-left: -27px;
  background-color: rgba(200, 200, 200, 0.8);
`;

const List = styled.div`
  margin-top: 52px;
`;
