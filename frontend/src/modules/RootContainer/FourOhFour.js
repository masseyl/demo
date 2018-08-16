import React, { PureComponent } from "react";
import Button from "../../components/button";
import Background from "../../components/background";
import { scale } from "../../transitions";

class FourOhFour extends PureComponent {
	topClick = () => {
		this.props.history.push({
			pathname: "/office/kioskExplainer",
			state: scale
		});
	};
	render() {
		return (
			<Background history={this.props.history}>
				<Button text="Nothing to see here" onClick={this.topClick} />
			</Background>
		);
	}
}
export default FourOhFour;
