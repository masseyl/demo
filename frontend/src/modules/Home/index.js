import React, { Component } from "react";

import { connect } from "react-redux";
import { debounce } from "lodash";

import { Subject } from "rxjs";
import { debounceTime, throttleTime } from "rxjs/operators";
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
    this.getMessageDebounceTimeMs = 100; //throttling amount for getting messages
    this.reloadTrigger = 50; //scroll amount before trying to load more messages ()
    this.subsequentLoadSize = 100;

    //undeo management
    this.endRemoveResetDelayMs = 500; //how long to wait to remove Undo popup
    this.deleteMessageDelay = 2000; // how quickly can messages be deleted
    this.endSwipeDelayMs = 1000; // how long to wait before swipe gesture is considered done

    this.state = {
      cardHeight: 148,
      confirmed: true,
      deleteMessageIndex: -1
    };
    this.createObservables();
    this.createSubscriptions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    this.updateWindowDimensions();
    if (!this.state.confirmed) {
      const confirmationPrompt = prompt("Please enter THE CODE");
      this.setState({ confirmed: confirmationPrompt === "fluffy" });
    }
    this.onGetMessages$.next();
  }

  componentWillUnmount() {
    clearInterval(this.endSwipeTimer);
    this.onGetMessagesSubscription.unsubscribe();
    this.onDeleteMessageSubscription.unsubscribe();
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  onScroll = evt => {
    const reloadThreshold =
      evt / this.reloadTrigger - Math.floor(evt / this.reloadTrigger);
    if (reloadThreshold === 0 && evt > this.lastScroll) {
      this.lastScroll = Math.max(evt, this.lastScroll);
      this.onGetMessages$.next();
      this.setState({
        forcerender: Math.random()
      });
    }
  };

  /**
   *@function calculateCardHeight
   * @param index <- the card
   *
   * Based on the number of lines of text calculate the height of the card
   * to pass to the Virtualized List based on lineHeight, fontsize, screen width,
   * and the number of characters in the content
   */
  calculateCardHeight = index => {
    const content = this.props.messages[index];
    const characters = content.content.length;
    const lineHeight = dimensions.lineHeight;
    const verticalPadding = lineHeight * 3.1;
    const width = window.innerWidth * 0.84; //92% of 92% closest I could get to responsive width
    const charsPerLine = width / (lineHeight / 2);
    const numLines = Math.min(4, Math.ceil(characters / charsPerLine));

    const height = verticalPadding + numLines * lineHeight + verticalPadding;
    return Math.min(height, height);
  };

  createDeleteMessages$ = () => {
    this.onDeleteMessage$ = new Subject();
    this.onDeleteMessageSubscription = this.onDeleteMessage$.pipe(
      throttleTime(this.deleteMessageDelay)
    );
  };

  createGetMessages$ = () => {
    this.onGetMessages$ = new Subject();
    this.onGetMessagesSubscription = this.onGetMessages$.pipe(
      debounceTime(this.getMessageDebounceTimeMs)
    );
  };

  createObservables = () => {
    this.createDeleteMessages$();
    this.createGetMessages$();
  };

  createSubscriptions = () => {
    this.createDeleteMessageSubscription();
    this.createGetMessagesSubscription();
  };

  createDeleteMessageSubscription = () => {
    this.onDeleteMessageSubscription.subscribe(index => {
      this.props.removeMessage(index);
      this.setState({
        deleteMessageIndex: index
      });
      const animationDelayTimer = setTimeout(() => {
        this.setState({
          deleteMessageIndex: -1
        });
        clearInterval(animationDelayTimer);
      }, 500);
    });
  };

  createGetMessagesSubscription = () => {
    this.onGetMessagesSubscription.subscribe(() => {
      this.props.getMessages(this.initialLoadSize, this.props.pageToken);
    });
  };

  endSwiping = () => {
    this.endSwipeTimer = setTimeout(() => {
      this.setState({ swiping: false });
      clearInterval(this.endSwipeTimer);
    }, this.endSwipeDelayMs);
  };

  removeMessage = index => this.onDeleteMessage$.next(index);

  showDetail = showHide => {
    this.showDetailTimeout = setTimeout(() => {
      this.setState({
        showDetail: showHide
      });
    }, 2);
  };

  startSwiping = index => {
    this.setState({ swiping: true, swipingIndex: index });
  };

  updateWindowDimensions = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      height,
      width,
      forcerender: Math.random()
    });
  };

  render() {
    const content = this.props.messages;
    const width = this.state.width;
    let listHeight = this.state.height || window.innerHeight;
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
              overflowX: "hidden"
            }}
            width={width * 0.96 + "px"}
            forcerender={this.state.forcerender}
            overscanCount={this.overscanCount}
            onScroll={this.onScroll}
            height={listHeight}
            itemCount={content.length}
            itemSize={this.calculateCardHeight}
            renderItem={({ index, style }) => {
              return (
                <div key={index} style={style}>
                  <SwipeableCard
                    forcerender={this.state.forcerender}
                    card={content[index]}
                    deletedMessageIndex={this.state.deleteMessageIndex}
                    endSwiping={this.endSwiping}
                    height={style.height - 56}
                    index={index}
                    isSwiping={this.state.swiping}
                    key={index}
                    removeMessage={this.removeMessage}
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
        {this.state.showDetail && (
          <DetailContainer
            toggle={this.showDetail}
            show={this.state.showDetail}
            width={width}
          >
            <DetailCard card={content[this.state.swipingIndex || 0]} />
          </DetailContainer>
        )}
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
    removeMessage: index => dispatch(removeMessage(index))
  };
}

export default connect(
  mapStateToProps,
  mapPropsToDispatch
)(Home);
