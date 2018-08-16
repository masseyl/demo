import { injectGlobal, keyframes } from "styled-components";

const transitionClassName = "scale";
const duration = 600;

const moveFromRight = keyframes`
from { transform: translateX(100%); }
`;

const moveOutRight = keyframes`
to { transform: translateX(-100%)}
`;

const scaleDown = keyframes`
to { transform: translateX(-1000%);opacity: 0.1; transform: scale(.1); }
`;

injectGlobal`
.${transitionClassName}-enter, .${transitionClassName}-exit {
  position: absolute;
}
.${transitionClassName}-enter-active, .${transitionClassName}-exit-active{
	position: absolute;
	height: 100vh;
	width: 100vw;
	overflow:auto;
}
.${transitionClassName}-exit-active {
  animation: ${moveOutRight} ${duration}ms ease both;
  z-index: 1;
}
.${transitionClassName}-enter-active {
  animation: ${moveFromRight} ${duration}ms ease both;
  z-index: 2;
}

`;

export default { transition: transitionClassName, duration };
