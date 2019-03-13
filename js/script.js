const element = query => document.querySelector(query);

let rangeContainer = element(".custom-range");
let rangeIndicatorContainer = element(".custom-range > .range-indicator");
let leftThumb = element(".custom-range > .thumb.left");
let rightThumb = element(".custom-range > .thumb.right");
let leftIndicatorContainer = element(".custom-range > .value-indicator.left");
let rightIndicatorContainer = element(".custom-range > .value-indicator.right");

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
  leftIndicatorContainer.style.opacity = rightIndicatorContainer.style.opacity = 0;
};

const calculateValue = thumbOffset =>
  Math.ceil((thumbOffset * rangeMaxValue) / (rangeWidth - thumbWidth));

const calculateLeftXPosition = event => {
  const mouseOffsetX = event.clientX;
  const thumbOffset =
    mouseOffsetX - rangeContainer.getBoundingClientRect().left - thumbWidth / 2;
  const value = calculateValue(thumbOffset);
  if (
    thumbOffset >= 0 &&
    thumbOffset <= rangeContainer.offsetWidth - thumbWidth &&
    thumbOffset < rightThumb.offsetLeft - thumbWidth
  ) {
    leftThumb.style.left = rangeIndicatorContainer.style.left = `${thumbOffset}px`;
    leftValue = value;
    leftIndicatorContainer.innerHTML = leftValue;
    leftIndicatorContainer.style.left = `${thumbOffset +
      thumbWidth / 2 -
      indicatorWidth / 2}px`;
  }
};
const calculateRightXPosition = event => {
  const mouseOffsetX = event.clientX;
  const thumbOffset =
    mouseOffsetX - rangeContainer.getBoundingClientRect().left + thumbWidth / 2;
  const value = calculateValue(thumbOffset - thumbWidth);
  if (
    thumbOffset >= thumbWidth &&
    thumbOffset <= rangeContainer.offsetWidth &&
    thumbOffset > leftThumb.offsetLeft + thumbWidth
  ) {
    rightThumb.style.left = `${thumbOffset - leftThumb.offsetWidth}px`;
    rangeIndicatorContainer.style.right = `${rangeWidth - thumbOffset}px`;
    rightValue = value;
    rightIndicatorContainer.innerHTML = value;
    rightIndicatorContainer.style.left = `${thumbOffset +
      thumbWidth / 2 -
      indicatorWidth / 2}px`;
  }
};
const leftThumbDrag = event => {
  leftIndicatorContainer.style.opacity = 1;
  document.addEventListener("mousemove", calculateLeftXPosition);
  document.addEventListener("mouseup", removeListener);
};
const rightThumbDrag = event => {
  rightIndicatorContainer.style.opacity = 1;
  document.addEventListener("mousemove", calculateRightXPosition);
  document.addEventListener("mouseup", removeListener);
};

leftThumb.addEventListener("mousedown", leftThumbDrag);

rightThumb.addEventListener("mousedown", rightThumbDrag);

rightIndicatorContainer.innerHTML = rightValue;
leftIndicatorContainer.innerHTML = leftValue;
