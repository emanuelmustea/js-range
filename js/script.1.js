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
    thumbOffset <= rangeContainer.offsetWidth - thumbWidth
  ) {
    leftThumb.style.left = `${thumbOffset}px`;
    if (thumbOffset < rightThumb.offsetLeft) {
      rangeIndicatorContainer.style.left = `${thumbOffset}px`;
      rangeIndicatorContainer.style.width = `${rightThumb.offsetLeft -
        thumbOffset}px`;
    } else {
      rangeIndicatorContainer.style.left = `${rightThumb.offsetLeft}px`;
      rangeIndicatorContainer.style.width = `${thumbOffset -
        rightThumb.offsetLeft}px`;
    }
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
    mouseOffsetX - rangeContainer.getBoundingClientRect().left - thumbWidth / 2;

  const value = calculateValue(thumbOffset);
  if (
    thumbOffset >= 0 &&
    thumbOffset <= rangeContainer.offsetWidth - thumbWidth
  ) {
    rightThumb.style.left = `${thumbOffset}px`;
    if (thumbOffset > leftThumb.offsetLeft) {
      rangeIndicatorContainer.style.left = `${leftThumb.offsetLeft}px`;
      rangeIndicatorContainer.style.width = `${thumbOffset -
        leftThumb.offsetLeft}px`;
    } else {
      rangeIndicatorContainer.style.left = `${thumbOffset}px`;
      rangeIndicatorContainer.style.width = `${leftThumb.offsetLeft -
        thumbOffset}px`;
    }
    rightValue = value;
    rightIndicatorContainer.innerHTML = value;
    rightIndicatorContainer.style.left = `${thumbOffset +
      thumbWidth / 2 -
      indicatorWidth / 2}px`;
  }
};
const leftThumbDrag = event => {
  document.addEventListener("mousemove", calculateLeftXPosition);
  document.addEventListener("mouseup", removeListener);
};
const rightThumbDrag = event => {
  document.addEventListener("mousemove", calculateRightXPosition);
  document.addEventListener("mouseup", removeListener);
};

leftThumb.addEventListener("mousedown", leftThumbDrag);

rightThumb.addEventListener("mousedown", rightThumbDrag);

rightIndicatorContainer.innerHTML = rightValue;
leftIndicatorContainer.innerHTML = leftValue;
