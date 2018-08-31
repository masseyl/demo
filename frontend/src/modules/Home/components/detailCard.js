import React, { Component } from "react";
import styled from "styled-components";
import Swipe from "react-easy-swipe";
import moment from "moment";
import { throttle } from "lodash";

const DetailCard = props => {
  const toggle = () => {
    props.toggle(false);
  };
  if (!props.card) return null;
  const photo = props.card.author.photoUrl;
  const author = props.card.author.name;
  const content = props.card.content;
  const updated = moment(props.card.updated).fromNow();
  return (
    <Container hide={props.hide} onClick={toggle}>
      <CardContainer>
        <TopRow>
          <Image src={"http://message-list.appspot.com" + photo} />
          <NameBox>
            <Author>{author}</Author>
            <ElapsedTime>{updated}</ElapsedTime>
          </NameBox>
        </TopRow>
        <Text>{content}</Text>
      </CardContainer>
    </Container>
  );
};

export default DetailCard;

const Author = styled.div`
  user-select: none;
  padding-top: 7px;
  font-weight: bold;
  font-size: 18px;
  color: rgba(22, 22, 22, 0.7);
`;

const CardContainer = styled.div`
  padding: 7px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px white;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: "absolute";
  bottom: -100;
  transform: scale3d(
    ${props => (props.hide ? -0.25 : 1)},
    ${props => (props.hide ? -0.25 : 1)},
    ${props => (props.hide ? -0.25 : 1)}
  );
  opacity: ${props => (props.hide ? 0.0 : 1)};
  transition: transform ${props => (props.hide ? 0.6 : 0.1)}s,
    opacity ${props => (props.hide ? 0.4 : 0.2)}s ease-in;
  width: 92%;
  margin-left: 4%;
  margin-bottom: 3px;
`;

const ElapsedTime = styled.p`
  user-select: none;
  font-size: 14px;
  color: rgba(99, 99, 99, 0.6);
  border-width: 1px;
  margin-top: 1px;
`;

const Image = styled.img`
  opacity: 1;
  width: 80px;
  height: 80px;
  border-radius: 60px;
  border-width: 1px;
  margin-right: 10px;
`;

const NameBox = styled.div`
  padding-top: 4px;
`;

const Text = styled.p`
  user-select: none;
  overflow-y: "scroll";
  font-size: 18px;
  color: rgba(11, 11, 11, 0.8);
  display: -webkit-box;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  height: 96px;
`;
