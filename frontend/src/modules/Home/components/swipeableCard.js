import React, { Component } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import moment from "moment";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";

import { endpoints, fontColors, dimensions } from "../../../config/defaults";
import { outAndIn, undo, touchdown } from "./animations";

class SwipeableCard extends Component {
  constructor(props) {
    super(props);
    this.lastX = 0;
    this.endSwipeTimeoutMs = 100;
    this.CSSAnimationTimeSeconds = 0.1;
    this.state = {
      x: 0,
      touchdown: false
    };
    this.createOnSwipe$();
  }

  componentWillUnmount = () => {
    clearInterval(this.deleteAnimationTimer);
    clearInterval(this.endSwipingTimeout);
  };

  onSwipeStart = event => {
    this.setState({
      touchdown: true
    });
    this.mouseIsDown = true;
    this.CSSAnimationTimeSeconds = 0.05;
    this.lastX = 0;
    this.props.startSwiping(this.props.index);
  };

  onSwipeMove = (position, event) => {
    event.stopPropagation();
    if (this.iAmSwiping && this.mouseIsDown) {
      this.onSwipe$.next(position);
    }
    this.iAmSwiping = true;
  };

  onSwipeEnd = event => {
    this.CSSAnimationTimeSeconds = 0.4;
    event.stopPropagation();
    this.showDetail();
    this.endSwiping();
  };

  createOnSwipe$ = () => {
    this.onSwipe$ = new Subject();
    this.onSwipeSubscription = this.onSwipe$.pipe(throttleTime(8));

    this.onSwipeSubscription.subscribe(position => {
      this.determineSwipeResponse(position.x);
    });
  };

  deleteMessage = () => {
    this.setState({ deletingMessage: true, x: 1000 });
    this.props.removeMessage(this.props.index);

    this.deleteAnimationTimer = setTimeout(() => {
      this.setState({ deletingMessage: false });
    }, dimensions.deleteAnimationTimer);
  };

  determineSwipeResponse = xx => {
    if (xx > this.props.width * 0.3 && !this.state.deletingMessage) {
      this.deleteMessage();
      this.endSwiping();
      this.lastX = 0;
    } else {
      this.lastX = xx;
      this.lastX = this.lastX > 0 ? this.lastX : 0;
      if (this.lastX > 30) {
        this.setState({
          x: this.lastX
        });
      }
    }
  };

  endSwiping = () => {
    this.iAmSwiping = false;

    this.endSwipingTimeout = setTimeout(() => {
      this.props.endSwiping();
      this.mouseIsDown = false;
      this.setState({
        x: 0,
        touchdown: false
      });
      clearInterval(this.endSwipingTimeout);
    }, this.endSwipeTimeoutMs);
  };

  showDetail = () => {
    if (this.mouseIsDown && !this.iAmSwiping) {
      this.mouseIsDown = false;
      this.props.showDetail(true);
    }
    this.endSwiping();
  };

  render() {
    const forcerender = this.props.forcerender;
    const deletingMessage = this.props.deletingMessage;
    const iWasDeleted = this.props.deletedMessageIndex === this.props.index;
    const photo = this.props.card.author.photoUrl;
    const author = this.props.card.author.name;
    const content = this.props.card.content;
    const updated = moment(this.props.card.updated).fromNow();
    return (
      <Container
        background={this.state.background}
        deletingMessage={deletingMessage}
        iWasDeleted={iWasDeleted}
        undoing={this.props.undoing}
        touchdown={this.state.touchdown}
        height={this.props.height}
        width={this.props.width}
        swiping={this.state.x > 0}
      >
        <Swipe
          allowMouseEvents
          onSwipeStart={this.onSwipeStart}
          onSwipeMove={this.onSwipeMove}
          onSwipeEnd={this.onSwipeEnd}
        >
          <CardContainer
            lineHeight={dimensions.lineHeight}
            height={this.props.height}
            x={this.state.x}
            animationSpeed={this.CSSAnimationTimeSeconds}
          >
            <TopRow>
              <Image
                src={`${endpoints.imagesBase}${photo}`}
                deletingMessage={deletingMessage}
              />
              <NameBox>
                <Author color={fontColors.dark}>{author}</Author>
                <ElapsedTime color={fontColors.light}>{updated}</ElapsedTime>
              </NameBox>
            </TopRow>
            <Text onClick={this.toggleDetail} color={fontColors.medium}>
              {content}
            </Text>
          </CardContainer>
        </Swipe>
      </Container>
    );
  }
}

export default SwipeableCard;

const Author = styled.div`
  color: ${props => props.color};
  font-size: 14px;
  font-weight: bold;
  margin-top: 18px;
  user-select: none;
`;

const CardContainer = styled.div.attrs({
  style: ({ height, lineHeight, x }) => {
    const newHeight = height + lineHeight * 2 + 3.5 + "px";
    return {
      height: newHeight,
      transform: "translate3D(" + 1.3 * x + "px,0,0)"
    };
  }
})`
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;

  background-color: white;
  padding: 7px 0 7px 7px;
  overflow: hidden;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  transition: transform ${props => props.animationSpeed}s;
`;

const Container = styled.div`
  animation: ${props =>
        props.deletingMessage && props.iWasDeleted ? outAndIn : null}
      1s linear,
    ${props => (props.undoing && props.iWasDeleted ? undo : null)} 0.35s
      ease-out,
    ${props => (props.touchdown ? touchdown : null)} 0.2s ease-out;

  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;

  height: ${props => props.height + dimensions.lineHeight * 3}px;
  background-color: rgba(255, 200, 100, 0.1);
  box-shadow: -1px 4px 8px #888888;

  margin-bottom: 3px;
  margin-left: 5%;
`;

const ElapsedTime = styled.p`
  border-width: 1px;
  color: ${props => props.color};
  font-size: 12px;
  margin-top: 1px;
  -webkit-user-drag: none;
  user-drag: none;
  user-select: none;
`;

const Image = styled.img`
  border-radius: 40px;
  border-width: 1px;
  height: 44px;
  margin-right: 10px;
  margin-top: 12px;
  user-drag: none;
  user-select: none;
  -webkit-user-drag: none;
  width: 44px;
`;

const NameBox = styled.div`
  padding-top: 4px;
`;

const Text = styled.p`
  color: ${props => props.color};
  display: -webkit-box;
  font-size: 14px;
  line-height: 16px;
  max-height: 56px;
  overflow-y: hidden;
  padding: 7px;
  padding-right: 14px;
  margin-left: 3.5px;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  user-drag: none;
  user-select: none;
  -webkit-user-drag: none;
`;

const TopRow = styled.div`
  user-drag: none;
  user-select: none;
  -webkit-user-drag: none;
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 48px;
  margin-left: 10px;
`;
