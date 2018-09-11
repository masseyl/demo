import React, { Component } from "react";

import { ActionCreators } from "redux-undo";
import { connect } from "react-redux";
import { debounce } from "lodash";

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

import { getMessages, removeMessage } from "./actions";
import { dimensions } from "../../config/defaults";

class Home extends Component {
  constructor(props) {
    super(props);

    this.headerHeight = dimensions.headerHeight;
    this.overscanCount = 10;
    //loading management
    this.initialLoadSize = 100;
    this.lastScroll = 1; //updated every scroll. used to determine when to load the next round of messages
    this.messageDebounceTimeMs = 100; //throttling amount for getting messages
    this.reloadTrigger = 50; //scroll amount before trying to load more messages ()
    this.subsequentLoadSize = 100;

    //undeo management
    this.endRemoveResetDelayMs = 500; //how long to wait to remove Undo popup
    this.removeThrottleMs = 2000; // how quickly can messages be deleted
    this.endSwipeDelayMs = 1000; // how long to wait before swipe gesture is considered done

    this.state = {
      cardHeight: 148,
      confirmed: true,
      deleteMessageIndex: -1
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    if (!this.state.confirmed) {
      const confirmationPrompt = prompt("Please enter THE CODE");
      this.setState({ confirmed: confirmationPrompt === "fluffy" });
    }
    this.props.getMessages(this.initialLoadSize, this.props.pageToken);
  }

  componentWillUnmount() {
    clearInterval(this.showUndoTimer);
    clearInterval(this.endSwipeTimer);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  /* If we've scrolled forward far enough replenish the list */
  onScroll = evt => {
    const reloadThreshold =
      evt / this.reloadTrigger - Math.floor(evt / this.reloadTrigger);
    if (reloadThreshold === 0 && evt > this.lastScroll) {
      this.lastScroll = Math.max(evt, this.lastScroll);
      this.debounceGetMessages();
      this.setState({
        //force virtualized list to update with new content reference
        forcer: Math.random()
      });
    }
  };

  calculateCardHeight = index => {
    const content = this.props.messages[index];
    const characters = content.content.length;
    const lineHeight = dimensions.lineHeight;
    const verticalPadding = lineHeight * 3;
    const width = window.innerWidth * 0.84; //92% of 92% closest I could get to responsive width
    const charsPerLine = width / (lineHeight / 2);
    const numLines = Math.min(4, Math.ceil(characters / charsPerLine));
    const height = verticalPadding + numLines * lineHeight + verticalPadding;
    return Math.min(height, height);
  };

  endSwiping = () => {
    //give the ending animation time to complete
    this.endSwipeTimer = setTimeout(() => {
      this.setState({ swiping: false });
      clearInterval(this.endSwipeTimer);
    }, this.endSwipeDelayMs);
  };

  showDetail = showHide => {
    this.setState({
      showDetail: showHide
    });
  };

  startSwiping = index => {
    this.setState({ swiping: true, swipingIndex: index });
  };

  debounceGetMessages = debounce(() => {
    this.props.getMessages(this.subsequentLoadSize, this.props.pageToken);
  }, this.messageDebounceTimeMs);

  debounceRemoveMessage = debounce(index => {
    //setting state to the current card starts the animations
    this.setState({
      deleteMessageIndex: index
    });
    //and update the view data *AFTER* animations have completed
    //otherwise it looks crappy
    this.showUndoTimer = setTimeout(() => {
      this.props.removeMessage(index);
      this.setState({
        deleteMessageIndex: -1
      });
      clearInterval(this.showUndoTimer);
    }, this.endRemoveResetDelayMs);
  }, this.removeThrottleMs);

  undoDelete = () => {
    this.props.undo();
    clearInterval(this.showUndoTimer);
  };

  updateWindowDimensions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const width = isIOS ? window.screen.width : window.innerWidth;
    const height = isIOS ? window.screen.height : window.innerHeight;
    if (isIOS) alert("resize");
    this.setState({
      height,
      width,
      forcer: Math.random()
    });
  };

  render() {
    const content = this.props.messages;
    const width = this.state.width || window.innerWidth;
    let listHeight = this.state.height || window.innerHeight;
    listHeight -= this.headerHeight;
    if (!this.state.confirmed) return null;

    return (
      <Background>
        <Undo
          onClick={this.undoDelete}
          showHide={this.props.removingMessage}
          width={width}
        />
        <Header zIndex={2} />
        <ListContainer>
          <VirtualList
            style={{
              overflowX: "hidden",
              width: width + "px"
            }}
            forcer={this.state.forcer}
            overscanCount={this.overscanCount}
            onScroll={this.onScroll}
            height={listHeight}
            itemCount={content.length}
            itemSize={this.calculateCardHeight}
            renderItem={({ index, style }) => {
              return (
                <div key={index} style={style}>
                  <SwipeableCard
                    forcer={this.state.forcer}
                    card={content[index]}
                    deletedMessageIndex={this.state.deleteMessageIndex}
                    endSwiping={this.endSwiping}
                    height={style.height - 56}
                    index={index}
                    isSwiping={this.state.swiping}
                    key={index}
                    removeMessage={this.debounceRemoveMessage}
                    showDetail={this.showDetail}
                    startSwiping={this.startSwiping}
                    swipingIndex={this.state.swipingIndex}
                    width={this.state.width}
                  />
                </div>
              );
            }}
          />
        </ListContainer>
        <Loading showHide={!this.props.messagesLoaded} width={width} />
        <DetailContainer
          toggle={this.showDetail}
          show={this.state.showDetail}
          width={width}
        >
          <DetailCard card={content[this.state.swipingIndex || 0]} />
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
