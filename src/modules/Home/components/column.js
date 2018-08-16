import React, { PureComponent } from "react";
import Background from "../../../components/background";
import Button from "../../../components/button";
import Card from "./card";
const Column = props => {
	return (
		<div
			style={{
				margin: "25px",
				borderWidth: "1px",
				borderColor: "gray",
				width: "25%"
			}}
		>
			<div
				style={{
					backgroundColor: props.cardData[0].bgColor,
					display: "flex",
					flexDireciton: "row"
				}}
			>
				{props.cardData[0].title}
			</div>
			{props.cardData.map((card, index) => {
				return <Card words={card} key={index} />;
			})}
			<Button
				text="Add Card"
				onClick={() => {
					props.addCard(props.columnNumber);
				}}
			/>
		</div>
	);
};

export default Column;
