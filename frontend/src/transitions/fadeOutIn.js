import { injectGlobal, keyframes } from "styled-components";

const transitionClassName = "fadeOutIn";
const duration = 2000;

const fadeIn = keyframes`
from { opacity:0}
to { opacity:1}
`;

const fadeOut = keyframes`
from { opacity:1}
to { opacity:0}
`;

injectGlobal`
.${transitionClassName}-enter, .${transitionClassName}-exit {
  position: absolute;
  top: 0;
  left: 0;
}
.${transitionClassName}-enter-active, .${transitionClassName}-exit-active{
	position: absolute;
	height: 100vh;
	width: 100vw;
	overflow:auto;
	// animation-duration: 4s;

	// transition: opacity ${duration}ms;
}
.${transitionClassName}-exit {
  animation: ${fadeOut} ${duration}ms ease both;
}
.${transitionClassName}-enter {
  animation: ${fadeIn} ${duration}ms ease ${duration}ms both;
}

.${transitionClassName}-enter-active {
  opacity: 0;
}

`;

export default { transition: transitionClassName, duration };
