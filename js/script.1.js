const getElement = query => document.querySelector(query);

const rangeContainer = getElement(".custom-range");
const rangeIndicatorContainer = getElement(".custom-range > .range-indicator");
const leftThumb = getElement(".custom-range > .thumb.left");
const rightThumb = getElement(".custom-range > .thumb.right");
const leftIndicatorContainer = getElement(".custom-range > .value-indicator.left");
const rightIndicatorContainer = getElement(".custom-range > .value-indicator.right");

const rangeMinValue = parseInt(rangeContainer.getAttribute("data-min"));
const rangeMaxValue = parseInt(rangeContainer.getAttribute("data-max"));
const rangeStepValue = parseInt(rangeContainer.getAttribute("data-step"));
const thumbWidth = leftThumb.offsetWidth;
const indicatorWidth = leftIndicatorContainer.offsetWidth;
const rangeWidth = rangeContainer.offsetWidth;
let leftValue = rangeMinValue;
let rightValue = rangeMaxValue;

const removeListener = event => {
  document.removeEventListener("mousemove", calculateLeftXPosition);
  document.removeEventListener("mousemove", calculateRightXPosition);
};

const calculateValue = thumbOffset => Math.ceil((thumbOffset * rangeMaxValue) / (rangeWidth - thumbWidth));
const calculateLeftXPosition = event => {
  const mouseOffsetX = event.clientX;
  const thumbOffset = mouseOffsetX - rangeContainer.getBoundingClientRect().left - thumbWidth / 2;
  const value = calculateValue(thumbOffset);
  if (thumbOffset >= 0 && thumbOffset <= rangeContainer.offsetWidth - thumbWidth) {
    leftThumb.style.left = `${thumbOffset}px`;
    if (thumbOffset < rightThumb.offsetLeft) {
      rangeIndicatorContainer.style.left = `${thumbOffset}px`;
      rangeIndicatorContainer.style.width = `${rightThumb.offsetLeft - thumbOffset}px`;
    } else {
      rangeIndicatorContainer.style.left = `${rightThumb.offsetLeft}px`;
      rangeIndicatorContainer.style.width = `${thumbOffset - rightThumb.offsetLeft}px`;
    }
    leftValue = value;
    leftIndicatorContainer.innerHTML = leftValue;
    rightIndicatorContainer.style.zIndex = 0;
    leftIndicatorContainer.style.left = `${thumbOffset + thumbWidth / 2 - indicatorWidth / 2}px`;
  }
};
const calculateRightXPosition = event => {
  const mouseOffsetX = event.clientX;
  const thumbOffset = mouseOffsetX - rangeContainer.getBoundingClientRect().left - thumbWidth / 2;

  const value = calculateValue(thumbOffset);
  if (thumbOffset >= 0 && thumbOffset <= rangeContainer.offsetWidth - thumbWidth) {
    rightThumb.style.left = `${thumbOffset}px`;
    if (thumbOffset > leftThumb.offsetLeft) {
      rangeIndicatorContainer.style.left = `${leftThumb.offsetLeft}px`;
      rangeIndicatorContainer.style.width = `${thumbOffset - leftThumb.offsetLeft}px`;
    } else {
      rangeIndicatorContainer.style.left = `${thumbOffset}px`;
      rangeIndicatorContainer.style.width = `${leftThumb.offsetLeft - thumbOffset}px`;
    }
    rightValue = value;
    rightIndicatorContainer.innerHTML = value;
    rightIndicatorContainer.style.zIndex = 1;
    rightIndicatorContainer.style.left = `${thumbOffset + thumbWidth / 2 - indicatorWidth / 2}px`;
  }
};
const isLeftThumbCloser = (mouseOffsetX, rangeContainerPosition) => {
  let leftOffset = mouseOffsetX - leftThumb.offsetLeft - rangeContainerPosition;
  let rightOffset = mouseOffsetX - rightThumb.offsetLeft - rangeContainerPosition;
  if (leftOffset < 0) {
    leftOffset -= thumbWidth;
  } else {
    rightOffset -= thumbWidth;
  }
  return Math.abs(leftOffset) <= Math.abs(rightOffset) ? true : false;
};
const instantMove = event => {
  const rangeContainerPosition = rangeContainer.getBoundingClientRect().left;
  const mouseOffsetX = event.clientX;
  if (isLeftThumbCloser(mouseOffsetX, rangeContainerPosition)) {
    calculateLeftXPosition(event);
    document.addEventListener("mousemove", calculateLeftXPosition);
  } else {
    calculateRightXPosition(event);
    document.addEventListener("mousemove", calculateRightXPosition);
  }
};

rangeContainer.addEventListener("mousedown", instantMove);
document.addEventListener("mouseup", removeListener);

rightIndicatorContainer.innerHTML = rightValue;
leftIndicatorContainer.innerHTML = leftValue;
