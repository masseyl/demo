import { injectGlobal, keyframes } from "styled-components";

const transitionClassName = "slide";
const duration = 600;

const moveFromLeft = keyframes`
from { transform: translateX(-100%); }
`;
const scaleDown = keyframes`
to { transform: translateX(100%);  }
`;

injectGlobal`
.${transitionClassName}-enter, .${transitionClassName}-exit {
  position: absolute;
}
.${transitionClassName}-enter-active, .${transitionClassName}-exit-active{
	position: absolute;
	width: 100vw; 
}
.${transitionClassName}-enter-active {
  animation: ${moveFromLeft} ${duration}ms ease both;
  z-index: 2;
}
.${transitionClassName}-exit-active {
  animation: ${scaleDown} ${duration}ms ease both;
  z-index: 1;
}
`;

export default { transition: transitionClassName, duration };
