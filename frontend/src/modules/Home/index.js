import React, { Component } from "react";

import { ActionCreators } from "redux-undo";
import { connect } from "react-redux";
import { throttle } from "lodash";

//visual components
import VirtualList from "react-tiny-virtual-list";
import Background from "../../components/background";
import DetailCard from "./components/detailCard";
import DetailContainer from "./components/detailContainer";
import Header from "./components/header";
import ListContainer from "./components/listContainer";
import Loading from "./components/loading";
import SwipeableCard from "./components/swipeableCard";
import Undo from "./components/undo";

//actions
import { getMessages, removeMessage } from "./actions";

class Home extends Component {
  constructor(props) {
    super(props);

    this.headerHeight = 52;

    //loading management
    this.initialLoadSize = 50;
    this.lastScroll = 1; //used to determine when to load the next round of messages
    this.messageThrottleMs = 10; //throttling for getting messages
    this.reloadTrigger = 100; //scroll amount before trying to load more messages ()
    this.subsequentLoadSize = 100;

    //undeo management
    this.endRemoveResetDelayMs = 500; //how long to wait to remove Undo
    this.removeThrottleMs = 2000;
    this.endSwipeDelayMs = 1000; // how long to wait before swipe gesture is considered done

    this.state = {
      deleteMessageIndex: -1,
      confirmed: true,
      messages: [],
      cardHeight: 136
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.props.getMessages(this.initialLoadSize, this.props.pageToken);
    if (!this.state.confirmed) {
      const confirmationPrompt = prompt("Please enter THE CODE");
      this.setState({ confirmed: confirmationPrompt === "fluffy" });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  onScroll = evt => {
    const reloadThreshold =
      evt / this.reloadTrigger - Math.floor(evt / this.reloadTrigger);
    if (reloadThreshold === 0 && evt > this.lastScroll) {
      this.lastScroll = Math.max(evt, this.lastScroll);
      this.throttleGetMessages();
      this.setState({
        //force virtualized list to update with new content reference
        forcer: Math.random()
      });
    }
  };

  endSwiping = () => {
    //give the ending animation time to complete
    this.endSwipeTimer = setTimeout(() => {
      this.setState({ swiping: false });
      clearInterval(this.endSwipeTimer);
    }, this.endSwipeDelayMs);
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
    this.setState({ swiping: true, swipingIndex: index });
  };

  throttleGetMessages = throttle(() => {
    this.props.getMessages(this.subsequentLoadSize, this.props.pageToken);
  }, this.messageThrottleMs);

  throttleRemoveMessage = throttle(index => {
    //setting state to the current card starts the animations
    this.setState({
      deleteMessageIndex: index
    });
    //and update the view data *AFTER* animations have completed
    //otherwise it looks crappy
    this.removeTimer = setTimeout(() => {
      this.props.removeMessage(index);
      this.setState({
        deleteMessageIndex: -1
      });
    }, this.endRemoveResetDelayMs);
    //yeh it looks weird to have a timeout inside a throttle, but it's efficient
  }, this.removeThrottleMs);

  undoDelete = () => {
    this.props.undo();
  };

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight, width: window.innerWidth });
  };

  render() {
    const content = this.props.messages;
    let listHeight = this.state.height ? this.state.height : window.innerHeight;
    listHeight -= this.headerHeight;
    if (!this.state.confirmed) return null;

    return (
      <Background>
        <Undo onClick={this.undoDelete} showHide={this.props.removingMessage} />
        <Header zIndex={2} />
        <ListContainer>
          <VirtualList
            overscanCount={this.overscanCount}
            onScroll={this.onScroll}
            height={listHeight}
            itemCount={content.length}
            itemSize={this.state.cardHeight}
            renderItem={({ index, style }) => (
              <div key={index} style={style}>
                <SwipeableCard
                  card={content[index]}
                  deletedMessageIndex={this.state.deleteMessageIndex}
                  endSwiping={this.endSwiping}
                  height={this.state.cardHeight - 4}
                  index={index}
                  isSwiping={this.state.swiping}
                  key={index}
                  removeMessage={this.removeMessage}
                  showDetail={() => this.showDetail(true)}
                  startSwiping={this.startSwiping}
                  swipingIndex={this.state.swipingIndex}
                  width={this.state.width}
                />
              </div>
            )}
          />
        </ListContainer>
        <Loading showHide={!this.props.messagesLoaded} />
        <DetailContainer show={this.state.showDetail}>
          <DetailCard
            card={content[this.state.swipingIndex || 0]}
            toggle={this.showDetail}
          />
        </DetailContainer>
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
