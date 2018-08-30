import React, { Component } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import moment from "moment";
import { throttle } from "lodash";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleX: 1,
      scaleY: 1,
      x: 0,
      textHeight: "45px",
      clamp: 3,
      scroll: "hidden",
      isCollapsed: true,
      animationSpeed: 0.05
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isScrolling) return true;
    if (nextProps.isSwiping && nextProps.swipingIndex === this.props.index) {
      return true;
    }
    if (
      nextProps.isSwiping &&
      (nextProps.swipingIndex > this.props.index - 4 ||
        nextProps.swipingIndex < this.props.index + 4)
    ) {
      return true;
    }
    if (nextProps.deleteMessageIndex === -1) return true;
    if (
      nextProps.deleteMessageIndex !== -1 &&
      (nextProps.deleteMessageIndex === this.props.index ||
        nextProps.deleteMessageIndex < this.props.index + 4 ||
        nextProps.deleteMessageIndex > this.props.index - 4)
    ) {
      return true;
    }
    if (nextState.scaleX === 0) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.velocityArray = [0];
    this.lastX = 0;
    this.toggleHeight();
    if (this.props.placeHolder) {
      this.placeholderTimer = setTimeout(() => {
        if (this.placeholderTimer) {
          this.setState({
            scaleX: 0,
            scaleY: 0,
            animationSpeed: 0.5
          });
        }
      }, 1);
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.chaosTimer);
    clearInterval(this.timeout);
    clearInterval(this.placeholderTimer);
  };

  onSwipeStart = () => {
    this.setState({ iAmSwiping: true });
  };
  onSwipeMove = (position, event) => {
    if (this.state.iAmSwiping) {
      this.whatToDo(position.x);
    }
  };

  onSwipeEnd = event => {
    this.endSwiping();
  };
  endSwiping = () => {
    this.setState({
      iAmSwiping: false,
      x: 0,
      animationSpeed: 0.5
    });
    this.timeout = setTimeout(() => {
      this.props.endSwiping();
      this.setState({ animationSpeed: 0.05 });
    }, 500);
  };

  calculateVelocity = deltaX => {
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

  whatToDo = xx => {
    const deltaX = xx - this.lastX;
    const velocity = this.calculateVelocity(deltaX);
    this.lastX = xx;

    if (
      xx > this.props.width * 0.8 ||
      (velocity > 1.6 && !this.state.deletingMessage)
    ) {
      this.setState({ deletingMessage: true });
      this.throttleDeleteMessage();
      this.velocityArray = [0];
      this.lastX = 0;
      this.endSwiping();
      this.setState({ scaleX: 0, scaleY: 0, x: 0 });
      this.expandoTimer = setTimeout(() => {
        this.setState({ scaleX: 1, scaleY: 1 });
      }, 750);
    } else {
      this.setState({
        x: xx > 0 ? xx : 0
      });
    }
  };
  start = event => {
    event.stopPropagation();
    this.props.startSwiping(this.props.index);
  };

  render() {
    const isPlaceHolder = this.props.deletedMessageIndex === this.props.index;
    const photo = isPlaceHolder ? "" : this.props.card.author.photoUrl;
    const author = isPlaceHolder ? "" : this.props.card.author.name;
    const content = isPlaceHolder ? "" : this.props.card.content;
    const updated = isPlaceHolder
      ? ""
      : moment(this.props.card.updated).fromNow();
    return (
      <Container
        killme={this.props.killme}
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
              <Image src={"http://message-list.appspot.com" + photo} />
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
  opacity: ${props => (props.killme ? 0 : 1)}
  transform: scale3d(${props => props.scaleX}, ${props => props.scaleY}, 1);
  transition: opacity transform 0.5s ease-out;
  width: 92%;
  margin-left: 4%;
  margin-bottom: 3px;
  background-color: red;
  box-shadow: ${props => (props.inset ? "4px 4px 8px" : "0 1px 4px")}
    ${props => (!props.inset ? "#888888" : "white")}
    ${props => (props.inset ? "inset" : null)};
`;

const ElapsedTime = styled.p`
  font-size: 12px;
  color: rgba(99, 99, 99, 0.6);
  border-width: 1px;
  margin-top: 1px;
`;

const Image = styled.img`
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
const backgrounds = [
  "./assets/surprised-face.jpg",
  "./assets/scary apk.jpg",
  "./assets/cat-humor-surprise-did-i-scare-you.jpg",
  "./assets/30992649-zombie-pumpkin-halloween-greeting-card-with-copyspace-as-a-scary-surprise-creepy-jack-o-lantern-with.jpg"
];
