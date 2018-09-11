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
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
  position: fixed;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(238, 238, 238, 0.9);
  -webkit-backface-visibility: hidden;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export default Background;
