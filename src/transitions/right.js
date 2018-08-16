import { injectGlobal, keyframes } from "styled-components";

const transitionClassName = "right";
const duration = 1000;

const slideOut = keyframes`
0% { }
25% { opacity: .5; transform: translateZ(-50.0rem); }
75% { opacity: .5; transform: translateZ(-50.0rem) translateX(-200%); }
100% { opacity: .5; transform: translateZ(-50.0rem) translateX(-200%); }
`;
const slideIn = keyframes`
0%, 25% { opacity: .5; transform: translateZ(-50.0rem) translateX(200%); }
75% { opacity: .5; transform: translateZ(-50.0rem); }
100% { opacity: 1; transform: translateZ(0) translateX(0); }
`;
injectGlobal`
.${transitionClassName}-exit-active {
  animation: ${slideOut} ${duration}ms both ease;
}
.${transitionClassName}-enter-active {
  animation: ${slideIn} ${duration}ms both ease;
}
`;

export default { transition: transitionClassName, duration };
