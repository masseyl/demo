import React from "react";
import styled from "styled-components";

const Loading = props => {
  return (
    <Container showHide={props.showHide} width={props.width}>
      <Spinner src="./assets/spinner.apng" />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  visibility: ${props => (props.showHide ? "visible" : "hidden")};
  z-index: 9999;
  height: 48px;
  width: 88%;
  max-width: ${props => props.width * 0.88}px;
  box-shadow: 2px 5px 40px 0;
  background-color: black;
  border-radius: 2px;
  margin-left: 6%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 5vh;
  background-color: rgba(255, 255, 255, 0.8);
`;

const Spinner = styled.img`
  width: 40px;
  height: 40px;
  align-self: center;
`;
export default Loading;
