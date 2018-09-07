import React from "react";
import styled from "styled-components";

const ListContainer = props => {
  return <Container>{props.children}</Container>;
};
const Container = styled.div`
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;

  margin-top: 52px;
  width: 92%;
  padding: 1px 14px 14px 14px;
`;
export default ListContainer;
