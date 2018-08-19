import React, { PureComponent } from "react";
import Background from "../../components/background";
import { scale } from "../../transitions";

class FourOhFour extends PureComponent {
	topClick = () => {
		this.props.history.push({
			pathname: "/",
			state: scale
		});
	};
	render() {
		return (
			<Background history={this.props.history}>
				<div onClick={this.topClick}> Nothing to see here</div>
			</Background>
		);
	}
}
export default FourOhFour;
