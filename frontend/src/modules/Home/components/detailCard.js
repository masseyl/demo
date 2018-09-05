import React from "react";
import styled from "styled-components";
import moment from "moment";
import { fontColors } from "../../../config/defaults";
import { endpoints } from "../../../config/defaults";

const DetailCard = props => {
  if (!props.card) return null;
  const photo = props.card.author.photoUrl;
  const author = props.card.author.name;
  const content = props.card.content;
  const updated = moment(props.card.updated).fromNow();
  return (
    <Container hide={props.hide}>
      <CardContainer>
        <TopRow>
          <Image src={`${endpoints.imagesBase}${photo}`} />
          <NameBox>
            <Author color={fontColors.dark}>{author}</Author>
            <ElapsedTime color={fontColors.light}>{updated}</ElapsedTime>
          </NameBox>
        </TopRow>
        <Text color={fontColors.medium}>{content}</Text>
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
  color: ${props => props.color};
`;

const CardContainer = styled.div`
  padding: 14px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px white;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale3d(
    ${props => (props.hide ? -0.25 : 1)},
    ${props => (props.hide ? -0.25 : 1)},
    ${props => (props.hide ? -0.25 : 1)}
  );
  opacity: ${props => (props.hide ? 0.0 : 1)};
  transition: transform ${props => (props.hide ? 0.6 : 0.1)}s,
    opacity ${props => (props.hide ? 0.4 : 0.2)}s ease-in;
  width: 92vw;
  max-height: 96vh;
  margin-bottom: 3px;
`;

const ElapsedTime = styled.p`
  user-select: none;
  font-size: 14px;
  color: ${props => props.color};
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
  max-height: 30vh;
  overflow-y: scroll;
  font-size: 18px;
  color: ${props => props.color};
  user-select: none;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  height: 96px;
`;
