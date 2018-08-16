import React, { PureComponent } from "react";
import key from "./key";
import styled from "styled-components";

const Row = props => {
	const keys = props.keys;
	return (
		<Row>
			{keys.map((key, index) => {
				return <Key label={key[index]} />;
			})}
			<div>{label}</div>
		</Row>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: : center;
	justify-content: : space-around;
`;

export default Row;
