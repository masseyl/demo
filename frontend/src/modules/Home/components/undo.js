import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { hideUndo } from "../actions";

class Undo extends Component {
  componentDidUpdate() {
    if (this.props.showHide) {
      this.undoTimer = setTimeout(() => {
        this.props.hideUndo();
        clearInterval(this.undoTimer);
      }, 5000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.undoTimer);
  }

  onClick = () => {
    this.props.onClick();
    this.props.hideUndo();
  };

  render() {
    return (
      <Container
        onClick={this.onClick}
        showHide={this.props.showHide}
        width={this.props.width}
      >
        <Message>Undo</Message>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    showHide: state.Home.present.undoable
  };
}
function mapPropsToDispatch(dispatch) {
  return {
    hideUndo: () => dispatch(hideUndo())
  };
}
export default connect(
  mapStateToProps,
  mapPropsToDispatch
)(Undo);

const Container = styled.div`
-webkit-backface-visibility: hidden;
-webkit-transform-style: preserve-3d;

	position: absolute;
	top: 7px;
	visibility: ${props => (props.showHide ? "visible" : "hidden")}
	z-index: 9999;
	height: 40px;
	width: 88%;
	max-width: ${props => props.width * 0.88}px;
	box-shadow: 2px 5px 40px 0;
	background-color: black;
	border-radius: 2px;
	margin-left: 6%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Message = styled.p`
  color: red;
  margin-left: 4%;
`;
