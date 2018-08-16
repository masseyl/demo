import { injectGlobal, keyframes } from "styled-components";

const transitionClassName = "fade";
const duration = 2000;

const fadeIn = keyframes`
from { opacity:0; z-index: 1}
to { opacity:1; z-index: 2}
`;

const moveOutRight = keyframes`

`;

const scaleDown = keyframes`
to { transform: translateX(-1000%);opacity: 0.1; transform: scale(.1); }
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
	animation-duration: 4s;
	// transition: opacity ${duration}ms;
}
.${transitionClassName}-exit {
  
  z-index: 1;
}
.${transitionClassName}-enter-active {
  animation: ${fadeIn} ${duration}ms ease both;
  // z-index: 2;
}

`;

export default { transition: transitionClassName, duration };
