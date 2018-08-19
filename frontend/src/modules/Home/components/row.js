import React, { PureComponent } from "react";
import key from "./key";
import styled from "styled-components";

const Undo = props => {
	const keys = props.keys;
	return (
		<Container>
			{keys.map((key, index) => {
				return <Key label={key[index]} />;
			})}
			<div>{label}</div>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: : center;
	justify-content: : space-around;
`;

export default Undo;
