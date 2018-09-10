let velocityArray = [0];
let lastX = 0;

calculateVelocity = xx => {
  const deltaX = xx - this.lastX;

  let velocity = 0;
  let velocityArray = [...this.velocityArray];
  velocityArray.push(deltaX);

  if (velocityArray.length > 10) {
    if (velocityArray.length >= 11) {
      velocityArray.unshift();
    }

    velocity = velocityArray.reduce(
      (average, nextValue) => (average + nextValue) / velocityArray.length,
      velocityArray[0]
    );
  }
  this.velocityArray = velocityArray;
  return velocity;
};

export const determineSwipeResponse = xx => {
  const velocity = calculateVelocity(xx);
  if (
    (xx > this.lastX && xx > this.props.width * 0.3) ||
    (velocity > 2 && !this.state.deletingMessage)
  ) {
    this.setState({ deletingMessage: true });
    this.throttleDeleteMessage();
    this.velocityArray = [0];
    this.lastX = 0;
    this.endSwiping();
  } else {
    if (xx > 0 && xx > this.lastX) {
      this.setState({
        x: xx
      });
    } else if (xx <= 0) {
      this.setState({
        x: 0
      });
    }
  }
  this.lastX = xx;
};
