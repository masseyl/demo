import React from "react";
import styled from "styled-components";

const Background = props => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const width = isIOS ? window.screen.width : window.innerWidth;
  return (
    <Container source={props.source} width={width}>
      <InnerContainer>
        {/*Inner container set to display:flex to allow flex-set child elements*/}
        {props.children}
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  justify-content: center;
  width: ${props => props.width}px;
  height: 100vh;
  background-color: rgba(238, 238, 238, 0.9);
  overflow: hidden;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export default Background;
