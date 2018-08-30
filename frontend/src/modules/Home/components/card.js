import React, { Component } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import moment from "moment";
import { throttle } from "lodash";

class Card extends Component {
  constructor(props) {
    super(props);
    this.velocityArray = [0];
    this.lastX = 0;
    this.lastY = 0;

    this.state = {
      x: 0,
      textHeight: "45px",
      clamp: 3,
      scroll: "hidden",
      isCollapsed: true,
      animationSpeed: 0.05
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    //instead of using a virtualized list, taking advantage of react's
    //component lifecycle
    // if (nextProps.isScrolling) return true;
    if (
      (nextProps.isScrolling || nextProps.isSwiping) &&
      (nextProps.swipingIndex > this.props.index - 4 ||
        nextProps.swipingIndex < this.props.index + 4)
    ) {
      return true;
    }
    if (
      nextProps.deletedMessageIndex !== -1 &&
      nextProps.deletedMessageIndex === this.props.index
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.toggleHeight();
  }

  componentWillUnmount = () => {
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

  calculateVelocity = (xx, yy) => {
    const deltaX = xx - this.lastX;
    const deltaY = yy - this.lastY;
    this.lastX = xx;
    this.lastY = yy;

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

  determineSwipeResponse = (xx, yy) => {
    const velocity = this.calculateVelocity(xx, yy);
    if (
      xx > this.props.width * 0.7 ||
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
  };

  endSwiping = () => {
    this.setState({
      iAmSwiping: false,
      x: 0,
      animationSpeed: 0.005
    });
    this.timeout = setTimeout(() => {
      this.props.endSwiping();
      this.setState({ animationSpeed: 0.05 });
    }, 500);
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

  toggleHeight = () => {
    const isCollapsed = !this.state.isCollapsed;
    //flip state
    this.setState({
      textHeight: isCollapsed ? "120px" : "45px",
      clamp: isCollapsed ? -1 : 3,
      scroll: isCollapsed ? "scroll" : "hidden",
      isCollapsed
    });
  };

  render() {
    const isPlaceHolder = this.props.deletedMessageIndex === this.props.index;
    const photo = isPlaceHolder ? "" : this.props.card.author.photoUrl;
    const author = isPlaceHolder ? "" : this.props.card.author.name;
    const content = isPlaceHolder ? "" : this.props.card.content;
    const deletingMessage = this.props.deletedMessageIndex === this.props.index;
    const updated = isPlaceHolder
      ? ""
      : moment(this.props.card.updated).fromNow();
    return (
      <Container
        deletingMessage={deletingMessage}
        onMouseDown={this.start}
        onTouchStart={this.start}
        background={this.state.background}
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
            scaleX={this.state.scaleX}
            scaleY={this.state.scaleY}
            amPlaceholder={this.props.placeHolder}
            x={this.state.x}
            animationSpeed={this.state.animationSpeed}
          >
            <TopRow>
              <Image
                src={"http://message-list.appspot.com" + photo}
                deletingMessage={deletingMessage}
              />
              <NameBox>
                <Author>{author}</Author>
                <ElapsedTime>{updated}</ElapsedTime>
              </NameBox>
            </TopRow>
            <Text
              onClick={this.toggleHeight}
              clamp={this.state.clamp}
              height={this.state.textHeight}
              scroll={this.state.scroll}
              onScroll={this.onScroll}
            >
              {content}
            </Text>
          </CardContainer>
        </Swipe>
      </Container>
    );
  }
}

export default Card;

const Author = styled.div`
  user-select: none;
  padding-top: 7px;
  font-weight: bold;
  font-size: 14px;
  color: rgba(22, 22, 22, 0.7);
`;

const CardContainer = styled.div`
  padding: 7px;
  background-color: white;
  transform: translate3d(${props => props.x}px, 0, 0);
  transition: transform ${props => props.animationSpeed}s ease-out;
`;

const Container = styled.div`
  transform: scale3d(
    ${props => (props.deletingMessage ? 0.1 : 1)},
    ${props => (props.deletingMessage ? 0.2 : 1)},
    ${props => (props.deletingMessage ? -10 : 1)}
  );
  transition: transform ${props => (props.deletingMessage ? 0.6 : 0.1)}s,
    opacity ${props => (props.deletingMessage ? 0.4 : 0.1)}s ease-in;
  opacity: ${props => (props.deletingMessage ? 0.5 : 1)};
  width: 92%;
  margin-left: 4%;
  margin-bottom: 3px;
  background-color: red;
  box-shadow: ${props => (props.inset ? "4px 4px 8px" : "0 1px 4px")}
    ${props => (!props.inset ? "#888888" : "white")}
    ${props => (props.inset ? "inset" : null)};
`;

const ElapsedTime = styled.p`
  user-select: none;
  font-size: 12px;
  color: rgba(99, 99, 99, 0.6);
  border-width: 1px;
  margin-top: 1px;
`;

const Image = styled.img`
  opacity: ${props => (props.deletingMessage ? 0 : 1)}
  width: 40px;
  height: 40px;
  border-radius: 30px;
  border-width: 1px;
  margin-right: 10px;
`;

const NameBox = styled.div`
  padding-top: 4px;
`;

const Text = styled.p`
  user-select: none;
  height: ${props => props.height};
  overflow-y: ${props => props.scroll};
  font-size: 14px;
  color: rgba(11, 11, 11, 0.8);
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.clamp};
  -webkit-box-orient: vertical;
  transition: height 0.5s ease-out;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  height: 48px;
`;
