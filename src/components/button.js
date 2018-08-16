import React from "react";
import styled from "styled-components";
import colors from "../config/defaultColors";

const Button = props => {
	let active = true;
	if (props.active !== undefined && props.active === false) active = false;
	return (
		<Container
			onClick={active ? props.onClick : null}
			fullWidth={props.fullWidth}
			noborder={props.noborder}
			fixedBottom={props.fixedBottom}
			active={active}
			className={props.className}
		>
			<Text
				fullWidth={props.fullWidth}
				noborder={props.noborder}
				small={props.small}
				fixedBottom={props.fixedBottom}
			>
				{props.text}
			</Text>
		</Container>
	);
};

const Container = styled.div``;
const Text = styled.span``;

export default Button;
