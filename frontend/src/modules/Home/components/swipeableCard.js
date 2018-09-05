import React, { Component } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import moment from "moment";
import { throttle } from "lodash";
import { endpoints } from "../../../config/defaults";
import { fontColors } from "../../../config/defaults";
import { dimensions } from "../../../config/defaults";

class SwipeableCard extends Component {
  constructor(props) {
    super(props);
    this.velocityArray = [0];
    this.lastX = 0;
    this.endSwipeTimeout = 500;
    this.fastAnimationTime = this.fastAnimationTime;
    this.normalAnimationTime = 0.05;
    this.lineCount = 3;
    this.fontSize = 14;
    this.state = {
      x: 0,
      scroll: "hidden",
      isCollapsed: true,
      animationSpeed: this.normalAnimationTime
    };
  }

  componentWillUnmount = () => {
    clearInterval(this.deletingTimer);
    clearInterval(this.timeout);
  };

  onSwipeStart = event => {
    this.setState({ iAmSwiping: true });
  };

  onSwipeMove = (position, event) => {
    event.stopPropagation();
    if (this.state.iAmSwiping) {
      this.determineSwipeResponse(position.x, position.y);
    }
  };

  onSwipeEnd = event => {
    event.stopPropagation();
    this.endSwiping();
  };

  calculateVelocity = xx => {
    const deltaX = xx - this.lastX;

    let velocity = 0;
    let velocityArray = [...this.velocityArray];
    velocityArray.push(deltaX);

    if (velocityArray.length > 10) {
      if (velocityArray.length >= 11) {
        velocityArray.unshift();
      }

      velocity = velocityArray.reduce(
        (average, nextValue) => (average + nextValue) / velocityArray.length,
        velocityArray[0]
      );
    }
    this.velocityArray = velocityArray;
    return velocity;
  };

  determineSwipeResponse = xx => {
    const velocity = this.calculateVelocity(xx);
    if (
      (xx > this.lastX && xx > this.props.width * 0.3) ||
      (velocity > 2 && !this.state.deletingMessage)
    ) {
      this.setState({ deletingMessage: true });
      this.throttleDeleteMessage();
      this.velocityArray = [0];
      this.lastX = 0;
      this.endSwiping();
    } else {
      this.setState({
        x: xx > 0 ? xx : 0
      });
    }
    this.lastX = xx;
  };

  endSwiping = () => {
    this.setState({
      iAmSwiping: false,
      x: 0,
      animationSpeed: this.normalAnimationTime
    });
    this.timeout = setTimeout(() => {
      this.props.endSwiping();
      this.setState({ animationSpeed: this.fastAnimationTime });
      clearInterval(this.timeout);
    }, this.endSwipeTimeout);
    this.lastX = window.innerWidth * 2;
  };

  start = event => {
    event.stopPropagation();
    this.props.startSwiping(this.props.index);
  };

  throttleDeleteMessage = throttle(() => {
    this.setState({ iAmSwiping: false });
    this.props.removeMessage(this.props.index);
    this.deletingTimer = setTimeout(() => {
      this.setState({ deletingMessage: false });
    }, 2000);
  }, 2000);

  render() {
    const forcer = this.props.forcer;
    //deletingMessage is the variable that kicks off animations
    const deletingMessage = this.props.deletedMessageIndex === this.props.index;
    const photo = this.props.card.author.photoUrl;
    const author = this.props.card.author.name;
    const content = this.props.card.content;
    const updated = moment(this.props.card.updated).fromNow();
    return (
      <Container
        onMouseDown={this.start}
        onTouchStart={this.start}
        background={this.state.background}
        deletingMessage={deletingMessage}
        height={this.props.height}
        inset={this.state.x > 0}
        scaleX={this.state.scaleX}
        scaleY={this.state.scaleY}
      >
        <Swipe
          allowMouseEvents
          onSwipeStart={this.onSwipeStart}
          onSwipeMove={this.onSwipeMove}
          onSwipeEnd={this.onSwipeEnd}
        >
          <CardContainer
            onClick={this.props.showDetail}
            deletingMessage={deletingMessage}
            height={this.props.height}
            x={this.state.x}
            animationSpeed={this.state.animationSpeed}
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

const CardContainer = styled.div`
  height: ${props => props.height + dimensions.lineHeight * 2 + 3.5}px;
  background-color: white;
  padding: 7px 0 7px 7px;
  overflow: hidden
  transform: translate3d(
    ${props => (props.deletingMessage ? window.innerWidth * 2 : props.x)}px,
    0,
    0
  );
  transition: transform ${props => props.animationSpeed}s ease-out;
`;

const Container = styled.div`
  height: ${props => props.height + dimensions.lineHeight * 3}px;
  background-color: ${props => (props.inset ? "red" : "transparent")};
  box-shadow: ${props => (props.inset ? "4px 4px 8px" : "0 1px 4px")}
    ${props => (!props.inset ? "#888888" : "white")}
    ${props => (props.inset ? "inset" : null)};

  margin-bottom: 3px;
  margin-left: 4%;
  opacity: ${props => (props.deletingMessage ? 0.0 : 1)};
  transform: scale3d(
    ${props => (props.deletingMessage ? -0.25 : 1)},
    ${props => (props.deletingMessage ? -0.25 : 1)},
    ${props => (props.deletingMessage ? -0.25 : 1)}
  );
  transition: transform ${props => (props.deletingMessage ? 0.6 : 0.1)}s,
    opacity ${props => (props.deletingMessage ? 0.4 : 0.2)}s ease-in,
    background-color 0.2s ease-in;
`;

const ElapsedTime = styled.p`
  border-width: 1px;
  color: ${props => props.color};
  font-size: 12px;
  margin-top: 1px;
  user-select: none;
`;

const Image = styled.img`
  border-radius: 40px;
  border-width: 1px;
  height: 44px;
  margin-right: 10px;
  margin-top: 12px;
  opacity: ${props => (props.deletingMessage ? 0 : 1)}
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
  user-select: none;
`;

const TopRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 48px;
  margin-left: 10px;
`;
