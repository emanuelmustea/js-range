const getElement = query => document.querySelector(query);

const rangeContainer = getElement(".custom-range");
const rangeIndicatorContainer = getElement(".custom-range > .range-indicator");
const leftThumb = getElement(".custom-range > .thumb.left");
const rightThumb = getElement(".custom-range > .thumb.right");
const leftValueIndicatorContainer = getElement(".custom-range > .value-indicator.left");
const rightValueIndicatorContainer = getElement(".custom-range > .value-indicator.right");
const rangeMinValue = parseInt(rangeContainer.getAttribute("data-min"));
const rangeMaxValue = parseInt(rangeContainer.getAttribute("data-max"));
const rangeStepValue = parseInt(rangeContainer.getAttribute("data-step"));
const thumbWidth = leftThumb.offsetWidth;
const indicatorWidth = leftValueIndicatorContainer.offsetWidth;
const rangeWidth = rangeContainer.offsetWidth;
let leftValue = rangeMinValue;
let rightValue = rangeMaxValue;

const removeListener = () => {
  document.removeEventListener("mousemove", calculateLeftXPosition);
  document.removeEventListener("mousemove", calculateRightXPosition);
};

const getValue = thumbOffset => Math.ceil((thumbOffset * rangeMaxValue) / (rangeWidth - thumbWidth));
const getThumbOffset = event => event.clientX - rangeContainer.getBoundingClientRect().left - thumbWidth / 2;
const isThumbInsideRangeContainer = thumbOffset => thumbOffset >= 0 && thumbOffset <= rangeContainer.offsetWidth - thumbWidth;

const setRangeIndicatorContainer = (thumbOffset, standingThumbContainer) => {
  let left = thumbOffset < standingThumbContainer.offsetLeft ? thumbOffset : standingThumbContainer.offsetLeft;
  let width =
    thumbOffset < standingThumbContainer.offsetLeft ? standingThumbContainer.offsetLeft - thumbOffset : thumbOffset - standingThumbContainer.offsetLeft;
  rangeIndicatorContainer.style.left = `${left}px`;
  rangeIndicatorContainer.style.width = `${width}px`;
};
const setValueIndicatorContainer = (movingValueIndicatorContainer, value, zIndex, left) => {
  movingValueIndicatorContainer.innerHTML = value;
  movingValueIndicatorContainer.style.left = `${left}px`;
  rightValueIndicatorContainer.style.zIndex = zIndex;
};

const setThumbPosition = (movingThumbContainer, thumbOffset) => {
  movingThumbContainer.style.left = `${thumbOffset}px`;
};
const isLeftThumbCloserToMouse = (mouseOffsetX, rangeContainerPosition) => {
  let leftOffset = mouseOffsetX - leftThumb.offsetLeft - rangeContainerPosition;
  let rightOffset = mouseOffsetX - rightThumb.offsetLeft - rangeContainerPosition;
  if (leftOffset < 0) {
    leftOffset -= thumbWidth;
  } else {
    rightOffset -= thumbWidth;
  }
  return Math.abs(leftOffset) <= Math.abs(rightOffset);
};

calculateThumbPosition = (event, movingThumbContainer) => {
  const thumbOffset = getThumbOffset(event);
  const value = getValue(thumbOffset);
  const movingValueIndicatorContainer = movingThumbContainer === leftThumb ? leftValueIndicatorContainer : rightValueIndicatorContainer;
  const rightValueIndicatorOpacity = movingThumbContainer === leftThumb ? 0 : 1;
  const standingThumbContainer = movingThumbContainer === leftThumb ? rightThumb : leftThumb;
  const valueIndicatorLeftPosition = thumbOffset + thumbWidth / 2 - indicatorWidth / 2;
  if (isThumbInsideRangeContainer(thumbOffset)) {
    setThumbPosition(movingThumbContainer, thumbOffset);
    setRangeIndicatorContainer(thumbOffset, standingThumbContainer);
    setValueIndicatorContainer(movingValueIndicatorContainer, value, rightValueIndicatorOpacity, valueIndicatorLeftPosition);
  }
};

const calculateLeftXPosition = event => calculateThumbPosition(event, leftThumb);
const calculateRightXPosition = event => calculateThumbPosition(event, rightThumb);

const moveThumbOnMouseClick = event => {
  const rangeContainerPosition = rangeContainer.getBoundingClientRect().left;
  const mouseOffsetX = event.clientX;
  if (isLeftThumbCloserToMouse(mouseOffsetX, rangeContainerPosition)) {
    calculateLeftXPosition(event);
    document.addEventListener("mousemove", calculateLeftXPosition);
  } else {
    calculateRightXPosition(event);
    document.addEventListener("mousemove", calculateRightXPosition);
  }
};

rangeContainer.addEventListener("mousedown", moveThumbOnMouseClick);
document.addEventListener("mouseup", removeListener);

rightValueIndicatorContainer.innerHTML = rightValue;
leftValueIndicatorContainer.innerHTML = leftValue;
