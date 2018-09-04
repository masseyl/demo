import React from "react";
import styled from "styled-components";

const Background = props => {
  return (
    <Container source={props.source}>
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
  width: 100vw;
  height: 100vh;
  background-color: rgba(238, 238, 238, 0.9);
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Background;
