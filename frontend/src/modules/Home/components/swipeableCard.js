import React, { Component } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import moment from "moment";

import { endpoints, fontColors, dimensions } from "../../../config/defaults";

class SwipeableCard extends Component {
  constructor(props) {
    super(props);
    this.velocityArray = [0];
    this.lastX = 0;
    this.endSwipeTimeoutMs = 200;
    this.CSSAnimationTimeMs = 0.2;
    this.lineCount = 3;
    this.fontSize = 14;
    this.state = {
      x: 0
    };
  }

  componentWillUnmount = () => {
    clearInterval(this.deleteAnimationTimer);
    clearInterval(this.endSwipingTimeout);
  };

  onSwipeStart = event => {
    event.stopPropagation();
    this.mouseIsDown = true;
    this.lastX = 0;
    this.props.startSwiping(this.props.index);
  };

  onSwipeMove = (position, event) => {
    event.stopPropagation();
    if (this.iAmSwiping && this.mouseIsDown) {
      this.determineSwipeResponse(position.x);
    }
    this.iAmSwiping = true;
  };

  onSwipeEnd = event => {
    event.stopPropagation();
    this.endSwiping();
  };

  endSwiping = () => {
    this.setState({
      x: 0
    });
    console.log("endSwiping");
    this.mouseIsDown = false;
    this.iAmSwiping = false;

    this.endSwipingTimeout = setTimeout(() => {
      this.props.endSwiping();
      clearInterval(this.endSwipingTimeout);
    }, this.endSwipeTimeoutMs);
  };

  determineSwipeResponse = xx => {
    if (xx > this.props.width * 0.3 && !this.state.deletingMessage) {
      this.deleteMessage();
      this.endSwiping();
      this.velocityArray = [0];
      this.lastX = 0;
    } else {
      this.lastX = xx;
      this.lastX = this.lastX > 0 ? this.lastX : 0;
      this.setState({
        x: this.lastX
      });
    }
    console.log(this.state.x);
  };

  deleteMessage = () => {
    this.setState({ deletingMessage: true });
    this.props.removeMessage(this.props.index);

    this.deleteAnimationTimer = setTimeout(() => {
      this.setState({ deletingMessage: false });
    }, 2000);
  };

  showDetail = () => {
    console.log("showDetail 1");
    if (this.mouseIsDown && !this.iAmSwiping) {
      this.mouseIsDown = false;
      this.props.showDetail(true);
    }
  };
  render() {
    //"forcer" is a random number used to make sure the virtual list re-renders cards
    // on new items being added/removed from redux
    const forcer = this.props.forcer;
    //deletingMessage is the variable that kicks off CSS animations
    const deletingMessage = this.props.deletedMessageIndex === this.props.index;
    //content values
    const photo = this.props.card.author.photoUrl;
    const author = this.props.card.author.name;
    const content = this.props.card.content;
    const updated = moment(this.props.card.updated).fromNow();
    return (
      <Container
        onMouseUp={this.showDetail}
        background={this.state.background}
        deletingMessage={deletingMessage}
        height={this.props.height}
        swiping={this.state.x > 0}
      >
        <Swipe
          allowMouseEvents
          onSwipeStart={this.onSwipeStart}
          onSwipeMove={this.onSwipeMove}
          onSwipeEnd={this.onSwipeEnd}
        >
          <CardContainer
            deletingMessage={deletingMessage}
            height={this.props.height}
            x={this.state.x}
            animationSpeed={this.CSSAnimationTimeMs}
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

//the visibility and preserve3d are to minimize flickering on ios safari
const CardContainer = styled.div.attrs({
  style: ({ transform }) => ({ transform })
})`
-webkit-backface-visibility: hidden;
-webkit-transform-style: preserve-3d;

  height: ${props => props.height + dimensions.lineHeight * 2 + 3.5}px;
  background-color: white;
  padding: 7px 0 7px 7px;
  overflow: hidden
  transform: translate3d(
    ${props => {
      return props.deletingMessage ? 0 : props.x;
    }}px,
    0,
    0
  );
  transition: transform ${props => props.animationSpeed}s ease-out;
`;

const Container = styled.div.attrs({
  style: ({ transform }) => ({ transform })
})`
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;

  height: ${props => props.height + dimensions.lineHeight * 3}px;
  background-color: ${props => (props.swiping ? "red" : "transparent")};
  box-shadow: ${props => (props.swiping ? "4px 4px 4px inset" : "-1px 4px 8px")}
    ${props => (!props.swiping ? "#888888" : "white")}
    ${props => (props.swiping ? "swiping" : null)};

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
