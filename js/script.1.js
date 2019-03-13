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

const removeListener = event => {
  document.removeEventListener("mousemove", calculateLeftXPosition);
  document.removeEventListener("mousemove", calculateRightXPosition);
};

const getValue = thumbOffset => Math.ceil((thumbOffset * rangeMaxValue) / (rangeWidth - thumbWidth));
const getThumbOffset = event => event.clientX - rangeContainer.getBoundingClientRect().left - thumbWidth / 2;

const setRangeIndicatorContainer = (left, width) => {
  rangeIndicatorContainer.style.left = `${left}px`;
  rangeIndicatorContainer.style.width = `${width}px`;
};

const setValueIndicatorContainer = (currentIndicatorContainer, value, zIndex, left) => {
  currentIndicatorContainer.innerHTML = value;
  currentIndicatorContainer.style.left = `${left}px`;
  rightValueIndicatorContainer.style.zIndex = zIndex;
};

calculateThumbPosition = (event, currentThumbContainer) => {
  const thumbOffset = getThumbOffset(event);
  const value = getValue(thumbOffset);
  const currentValueIndicatorContainer =
    currentThumbContainer === leftThumb ? leftValueIndicatorContainer : rightValueIndicatorContainer;
  const rightValueIndicatorOpacity = currentThumbContainer === leftThumb ? 0 : 1;
  const otherThumbContainer = currentThumbContainer === leftThumb ? rightThumb : leftThumb;

  if (thumbOffset >= 0 && thumbOffset <= rangeContainer.offsetWidth - thumbWidth) {
    currentThumbContainer.style.left = `${thumbOffset}px`;
    if (thumbOffset < otherThumbContainer.offsetLeft) {
      setRangeIndicatorContainer(thumbOffset, otherThumbContainer.offsetLeft - thumbOffset);
    } else {
      setRangeIndicatorContainer(otherThumbContainer.offsetLeft, thumbOffset - otherThumbContainer.offsetLeft);
    }
    setValueIndicatorContainer(
      currentValueIndicatorContainer,
      value,
      rightValueIndicatorOpacity,
      thumbOffset + thumbWidth / 2 - indicatorWidth / 2
    );
  }
};

const calculateLeftXPosition = event => calculateThumbPosition(event, leftThumb);
const calculateRightXPosition = event => calculateThumbPosition(event, rightThumb);

const isLeftThumbCloserToMouse = (mouseOffsetX, rangeContainerPosition) => {
  let leftOffset = mouseOffsetX - leftThumb.offsetLeft - rangeContainerPosition;
  let rightOffset = mouseOffsetX - rightThumb.offsetLeft - rangeContainerPosition;
  if (leftOffset < 0) {
    leftOffset -= thumbWidth;
  } else {
    rightOffset -= thumbWidth;
  }
  return Math.abs(leftOffset) <= Math.abs(rightOffset) ? true : false;
};
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
