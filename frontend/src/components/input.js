import React from "react";
import styled from "styled-components";
import colors from "../config/defaultColors";

const NumberInput = props => {
	return (
		<Container>
			<Input
				type={props.type || "text"}
				value={props.value}
				onChange={props.onChange}
				bgImg={props.bgImg}
				placeholder={props.placeholder}
			/>
		</Container>
	);
};

const Input = styled.input`
	height: 5.3rem;
	border-radius: 9px;
	padding-left: 1rem;
	font-size: 2.1rem;
	margin: 7.5rem auto 0;
	margin-bottom: 1.5rem;
	color: #BFBFBF;
	font-style: italic;
	${props =>
		props.bgImg
			? `
					padding-left: 4.9rem;
					background-image: url("/assets/mobile.png");
					background-repeat: no-repeat;
					background-size: 3.7rem;
					background-position-x: 0.8rem;
					background-position-y: center;
				`
			: ""};
	/*

	*/
	width: 46.4vw;
	display: flex;
	border: none;

	&:focus{
		color:#000;
		outline:none;
		border:none
		font-style: normal;
	}

	& .error{border: #f00 solid 2px;}

`;
const Container = styled.div``;

export default NumberInput;
