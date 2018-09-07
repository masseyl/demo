import React from "react";
import styled from "styled-components";

const ListContainer = props => {
  return <Container width={props.width}>{props.children}</Container>;
};
const Container = styled.div`
  margin-top: 52px;
  width: 92%;
  max-width: ${props => props.width / 2}
  padding: 1px 14px 14px 14px;
`;
export default ListContainer;
