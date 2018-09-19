import React, { Component } from "react";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import { debounceTime, throttleTime, map } from "rxjs/operators";
import { ActionCreators } from "redux-undo";

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
import { dimensions, sharedTimings } from "../../config/defaults";

const OVERSCAN_COUNT = 20;
const INITIAL_LOAD_SIZE = 150;
const MESSAGE_DEBOUNCE_TIME = 100;
const RELOAD_TRIGGER = 3000;
const MESSAGE_DELETION_DELAY = 500;
const SWIPE_END_DELAY = 500;

class Home extends Component {
  constructor(props) {
    super(props);
    this.headerHeight = dimensions.headerHeight;
    this.edgeDetector = true;

    //loading management
    this.edgeDetector = true;
    this.maxScrollPosition = 1;
    this.lastScroll = 1; //updated every scroll. used to determine when to load the next round of messages

    this.state = {
      cardHeight: 148,
      confirmed: false,
      deletedMessageIndex: -1,
      undoOffset: 0
    };

    this.createDeleteMessages$();
    this.createGetMessages$();
    this.createOnScroll$();
  }

  componentDidMount() {
    if (!this.state.confirmed) {
      const confirmationPrompt = prompt("Please enter THE CODE");
      this.setState({ confirmed: confirmationPrompt === "fluffy" });
    }
    window.addEventListener("resize", this.updateWindowDimensions);
    this.updateWindowDimensions();
    this.onGetMessages$.next();
  }

  componentWillUnmount() {
    clearInterval(this.endSwipeTimer);
    this.onGetMessagesSubscription.unsubscribe();
    this.onDeleteMessageSubscription.unsubscribe();
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  onScroll = scrollPosition => {
    this.onScroll$.next({
      scrollPosition,
      reloadTrigger: RELOAD_TRIGGER,
      edgeDetector: this.edgeDetector
    });
  };

  /**
   *@function calculateCardHeight
   * @param index <- the card
   *
   * Based on the number of lines of text calculate the height of the card
   * to pass to the Virtualized List based on lineHeight, fontsize, screen width,
   * and the number of characters in the content
   * charsPerLine is a VERY rough estimate
   */
  calculateCardHeight = index => {
    const content = this.props.messages[index];
    const characters = content.content.length;
    const lineHeight = dimensions.lineHeight;
    const verticalOffset = dimensions.cardTextVerticalOffset;
    const width = window.innerWidth * 0.84; //92% of 92% closest I could get to responsive width
    const charsPerLine = width / (lineHeight / 2); //es
    const numLines = Math.min(
      dimensions.maxLinesPerCard,
      Math.ceil(characters / charsPerLine)
    );

    const height = verticalOffset + numLines * lineHeight + verticalOffset;
    return Math.min(height, height);
  };

  createDeleteMessages$ = () => {
    this.onDeleteMessage$ = new Subject();
    this.onDeleteMessageSubscription = this.onDeleteMessage$.pipe(
      throttleTime(MESSAGE_DELETION_DELAY)
    );
    this.onDeleteMessageSubscription.subscribe(index => {
      this.deletionAnimationControl(index);
      const removeMessageTimer = setTimeout(() => {
        this.props.removeMessage(index);
        clearInterval(removeMessageTimer);
      }, sharedTimings.removeMessageTimer);
    });
  };

  createGetMessages$ = () => {
    this.onGetMessages$ = new Subject();
    this.onGetMessagesSubscription = this.onGetMessages$.pipe(
      debounceTime(MESSAGE_DEBOUNCE_TIME)
    );
    this.onGetMessagesSubscription.subscribe(() => {
      this.props.getMessages(INITIAL_LOAD_SIZE, this.props.pageToken);
    });
  };

  createOnScroll$ = () => {
    this.onScroll$ = new Subject();
    this.onScrollSubscription = this.onScroll$.pipe(
      map(({ scrollPosition, reloadTrigger, edgeDetector }) => {
        let edge = edgeDetector;
        const modCounter = Math.floor(
          Math.floor(scrollPosition % reloadTrigger) / 100
        );
        if (modCounter === 0 && !edge) {
          edge = true;
        }
        if (modCounter !== 0) {
          edge = false;
        }
        return { edge, scrollPosition };
      })
    );

    this.onScrollSubscription.subscribe(({ edge, scrollPosition }) => {
      if (edge && this.maxScrollPosition < scrollPosition) {
        this.onGetMessages$.next();
        this.setState({
          forcerender: Math.random()
        });
      }
      this.maxScrollPosition = Math.max(scrollPosition, this.maxScrollPosition);
      this.edgeDetector = edge;
    });
  };

  /** Inform the card list which index was just deleted
   * @function deletionAnimationControl
   * @param index index of the card being deleted
   */
  deletionAnimationControl = index => {
    this.setState({
      deletedMessageIndex: index,
      deletingMessage: true
    });
    const animationDelayTimer = setTimeout(() => {
      this.setState({
        deletingMessage: false
      });
      clearInterval(animationDelayTimer);
    }, sharedTimings.animationDelayTimer);
  };

  endSwiping = () => {
    this.endSwipeTimer = setTimeout(() => {
      this.setState({ swiping: false });
      clearInterval(this.endSwipeTimer);
    }, SWIPE_END_DELAY);
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
      undoOffset: width > height ? this.headerHeight : 0,
      height,
      width,
      forcerender: Math.random()
    });
  };

  undoAnimationController = () => {
    this.setState({
      undoing: true
    });
    const undoTimer = setTimeout(() => {
      this.setState({
        undoing: false,
        forcerender: Math.random()
      });
      clearInterval(undoTimer);
    }, sharedTimings.undoTimer);
    this.props.undo();
  };

  render() {
    const content = this.props.messages;
    const width = this.state.width;
    let listHeight = this.state.height || window.innerHeight;
    if (!this.state.confirmed) return null;

    return (
      <Background>
        <Undo
          offset={this.state.undoOffset}
          onClick={this.undoAnimationController}
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
            overscanCount={OVERSCAN_COUNT}
            onScroll={this.onScroll}
            height={listHeight}
            itemCount={content.length}
            itemSize={this.calculateCardHeight}
            renderItem={({ index, style }) => {
              return (
                <div key={index} style={style}>
                  <SwipeableCard
                    undoing={this.state.undoing}
                    forcerender={this.state.forcerender}
                    card={content[index]}
                    deletingMessage={this.state.deletingMessage}
                    deletedMessageIndex={this.state.deletedMessageIndex}
                    endSwiping={this.endSwiping}
                    height={style.height - this.headerHeight}
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
    removeMessage: index => dispatch(removeMessage(index)),
    undo: () => dispatch(ActionCreators.undo())
  };
}

export default connect(
  mapStateToProps,
  mapPropsToDispatch
)(Home);
