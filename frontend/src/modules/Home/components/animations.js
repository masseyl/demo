import { keyframes } from "styled-components";

export const outAndIn = keyframes`
  from {
    transform: scale3d(1,1,1) translate3d(0,0,0);
  }
  50% {
    transform: scale3d(-1,-1,-1) translate3d(0,0,0);
  }
  75% {
    transform: scale3d(0,0,0) translate3d(100%,0,0);
  }
  90%{
    transform: translate3d(0,0,0);
  }
  to {
    transform: scale3d(1,1,1);
  }
`;
export const undo = keyframes`
  from {
    transform: translate3d(0,100px,0) scale3d(1,0,1)
  }
  to {
    transform: translate3d(0,0,0) scale3d(1,1,1)
  }
`;
