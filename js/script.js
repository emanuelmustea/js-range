const element = query => document.querySelector(query);
let rangeContainer = element(".custom-range");
let rangeIndicatorContainer = element(".custom-range > .range-indicator");
let leftThumb = element(".custom-range > .thumb.left");
let rightThumb = element(".custom-range > .thumb.right");
let leftIndicatorContainer = element(".custom-range > .value-indicator.left");
let rightIndicatorContainer = element(".custom-range > .value-indicator.right");
const rangeMinValue = parseInt(rangeContainer.getAttribute("data-min"));
const rangeMaxValue = parseInt(rangeContainer.getAttribute("data-max"));
const thumbWidth = leftThumb.offsetWidth;
const rangeWidth = rangeContainer.offsetWidth;
let leftValue = rangeMinValue;
let rightValue = rangeMaxValue;

const removeListener = event => {
  document.removeEventListener("mousemove", calculateLeftXPosition);
  document.removeEventListener("mousemove", calculateRightXPosition);
};

const calculateValue = thumbOffset =>
  Math.ceil((thumbOffset * rangeMaxValue) / (rangeWidth - thumbWidth));
const calculateOffset = mouseOffsetX =>
  mouseOffsetX - rangeContainer.getBoundingClientRect().left - thumbWidth / 2;
const calculateLeftXPosition = event => {
  const mouseOffsetX = event.clientX;
  const thumbOffset = calculateOffset(mouseOffsetX);
  const value = calculateValue(thumbOffset);
  if (
    thumbOffset >= 0 &&
    thumbOffset <= rangeContainer.offsetWidth - thumbWidth &&
    value <= rightValue
  ) {
    leftThumb.style.left = rangeIndicatorContainer.style.left = `${thumbOffset}px`;
    leftValue = value;
    leftIndicatorContainer.innerHTML = leftValue;
  }
};
const calculateRightXPosition = event => {
  const mouseOffsetX = event.clientX;
  const thumbOffset = calculateOffset(mouseOffsetX) + thumbWidth;
  const value = calculateValue(thumbOffset);
  if (
    thumbOffset >= 0 &&
    thumbOffset <= rangeContainer.offsetWidth - thumbWidth &&
    value >= leftValue
  ) {
    rightThumb.style.left = `${thumbOffset - leftThumb.offsetWidth}px`;
    rangeIndicatorContainer.style.right = `${rangeWidth - thumbOffset}px`;
    rightValue = value;
    rightIndicatorContainer.innerHTML = value;
  }
};

leftThumb.addEventListener("mousedown", event => {
  document.addEventListener("mousemove", calculateLeftXPosition);
  document.addEventListener("mouseup", removeListener);
});

rightThumb.addEventListener("mousedown", event => {
  document.addEventListener("mousemove", calculateRightXPosition);
  document.addEventListener("mouseup", removeListener);
});
rightIndicatorContainer.innerHTML = rightValue;
leftIndicatorContainer.innerHTML = leftValue;
